import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import { studentValidationSchema } from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;


    const zodparseData = studentValidationSchema.parse(studentData)
    const result = await StudentServices.createStudentIntoDB(zodparseData);

    res.status(200).json({
      success: true,
      message: 'Student is created succesfully',
      data: result,
    });
  } catch (err : any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create student', err });
  }
};

const getAllStudents = async (req : Request , res : Response) => {
  try{
    const result = await StudentServices.getAllStudentsfomDB();
    res.status(200).json({
      success: true,
      message : 'Students retrieved successfully',
      data: result
    })
  }catch(err : any){
    res.status(500).json({ success: false, message: err.message || 'Failed to create student', err });
  }
}

const getSingleStudent = async (req : Request , res : Response) => {
  try{
    const {studentId} = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success : true,
      message: 'Student is retrieved successfully',
      data: result
    })

  }catch(err: any){
    res.status(500).json({ success: false, message: err.message || 'Failed to create student', err });
  }
}

const deleteStudent = async (req: Request, res: Response) =>{
  try{
      const {studentId} =req.params;
      const result = await StudentServices.deleteStudentFromDB(studentId)

      res.status(200).json({
        success: true,
        message: 'Student is Deleted successfully',
        data: result
      })
  }catch(err: any){
    res.status(500).json({ success: false, message: err.message || 'Failed to create student', err });
  }
}



export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent
};
