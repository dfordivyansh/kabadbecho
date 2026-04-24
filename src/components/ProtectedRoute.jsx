import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { customerAuth, adminAuth, partnerAuth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔥 Decide which auth to use
  const getAuthInstance = () => {
    if (requiredRole === "admin") return adminAuth;
    if (requiredRole === "kabadi") return partnerAuth;
    return customerAuth;
  };

  useEffect(() => {
    const authInstance = getAuthInstance();

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (!currentUser) {
        // 🔥 redirect based on role
        if (requiredRole === "admin") {
          navigate("/admin/login", { replace: true });
        } else if (requiredRole === "kabadi") {
          navigate("/kabadi/login", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (!userDoc.exists()) {
          await signOut(authInstance);
          navigate("/login", { replace: true });
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        const userRole = (userData.role || "user").toLowerCase();
        const targetRole = requiredRole.toLowerCase();

        // 🔥 STRICT ROLE CHECK
        if (userRole !== targetRole) {
          console.warn("Unauthorized role:", userRole, "expected:", targetRole);

          await signOut(authInstance);

          if (targetRole === "admin") {
            navigate("/admin/login", { replace: true });
          } else if (targetRole === "kabadi") {
            navigate("/kabadi/login", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }

          setLoading(false);
          return;
        }

        setUser(currentUser);
      } catch (err) {
        console.error("Auth check failed", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F8E9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66BB6A]"></div>
      </div>
    );
  }

  return user ? children : null;
};

export default ProtectedRoute;