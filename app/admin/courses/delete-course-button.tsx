"use client";

import { useState } from "react";
import { deleteCourse } from "./actions";

export function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteCourse(courseId);
      if (res?.error) {
        alert(res.error);
      }
    } catch (err) {
      alert("An unexpected error occurred while deleting the course.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
