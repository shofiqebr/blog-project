import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const result = await StudentServices.createStudentIntoDB(studentData);

    res.status(200).json({
      success: true,
      message: 'Student is created succesfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ success: false, message: 'Failed to create student', error });
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
  }catch(err){
    console.log(err)
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

  }catch(err){
    console.log(err)
  }
}



export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
