import { Student } from "../../types";
import { students } from "../mockData";

/**
 * Service to handle student related operations
 */
export class StudentsService {
  /**
   * Fetch all registered students
   * @returns Promise resolving to an array of Students
   */
  static async getStudents(): Promise<Student[]> {
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return students;
  }

  /**
   * Fetch a student by their ID
   * @param id The ID of the student
   * @returns Promise resolving to the Student or null if not found
   */
  static async getStudentById(id: string): Promise<Student | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return students.find((student) => student.id === id) || null;
  }
}
