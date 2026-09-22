import { Course, CourseCategory } from "../../types";
import { courses } from "../mockData";

/**
 * Service to handle courses related operations
 * In a real application, this would make HTTP requests via fetch or axios
 */
export class CoursesService {
  /**
   * Fetch all courses, optionally filtered by category
   * @param category The category to filter by (default: "all")
   * @returns Promise resolving to an array of Courses
   */
  static async getCourses(category: CourseCategory = "all"): Promise<Course[]> {
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    if (category === "all") {
      return courses;
    }
    
    return courses.filter((course) => course.category === category);
  }

  /**
   * Fetch a specific course by its title (or ID in a real scenario)
   * @param title The exact title of the course
   * @returns Promise resolving to the Course or null if not found
   */
  static async getCourseByTitle(title: string): Promise<Course | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return courses.find((course) => course.title === title) || null;
  }
}
