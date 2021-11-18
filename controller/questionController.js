const User = require("../model/userModel");
const questionModel = require('../model/questionModel')
const answerModel = require('../model/answerModel')


const addQuestion =  async (req, res) => {
    if(req.method === 'GET'){
        res.render('addQuestion')
    }
    if(req.method === 'POST'){
        const {question , description} = req.body
        let errors = [] ;
        if (!question || !description) {
            errors.push({ msg: 'Please fill in all fields' })
        }
        if (question && question.length < 10) {
            errors.push({ msg: 'Question should be more than 10 characters' })
        }
        if (description && description.length < 15) {
            errors.push({ msg: 'Question should be more than 15 characters'})
        }
        if (errors.length > 0){
            res.render('addQuestion' , {
                pageTitle:'Add Question',
                errors,
                question,
                description
            })
        } else{
            id = res.locals.user.id
            user = await User.findById(id)
            const newQuestion = new questionModel({
                question,
                description,
                user: user
            })
            await newQuestion.save()
            res.redirect('/')

        }
	


    }
}


const showQuestion = async (req, res)=>{
    const question = await questionModel.findById(req.params.id).populate('user')
    const answers = await answerModel.find({ question }).populate('user').sort({ createdAt: -1 });
    res.render('showQuestion', {
        question,
        answers
    })
}


const addAnswer = async (req,res)=>{
    const  {answer} = req.body
    let errors = [];

    if (!answer) {
        errors.push({ msg: 'Please fill in answer input' })
    }
    if (answer && answer.length < 10) {
        errors.push({ msg: 'Please write an answer more than 10 characters' })
    }
    const question = await questionModel.findById(req.params.id).populate('user')
    const answers = await answerModel.find({ question }).populate('user').sort({ createdAt: -1 });
    if (errors.length > 0) {
        res.render('showQuestion', {
            errors,
            answer,
            question,
            answers
        })
    } else {
        const newAnswer = new answerModel({
            answer,
            question,
            user : res.locals.user.id
        }) 
        await newAnswer.save()
        res.redirect(`/question/${question._id}`)
    }
}


const deleteQuestion =  async(req,res)=>{
    const deleteQuestion = await questionModel.findByIdAndDelete(req.params.id)
    await answerModel.deleteMany({deleteQuestion})
    res.redirect('/')

}


const deleteAnswer = async (req,res)=>{
    const deleteAnswer =  await answerModel.findByIdAndDelete(req.params.id)
    res.redirect('/')
    
}


const editAnswer = async (req, res) => {
    const answer = await answerModel.findById(req.params.id)
    if(req.method === "GET"){
        res.render('editAnswer',{answer})
    }

    if(req.method === "POST"){
        await answerModel.findByIdAndUpdate(req.params.id ,req.body)
        res.redirect(`/question/${answer.question}`)
   
    }
}


const editQuestion = async (req , res) =>{
    const question = await questionModel.findById(req.params.id)
    if(req.method === 'GET'){
        res.render('editQuestion' ,{
            question,
        })
    }
    if(req.method === 'POST'){
        await questionModel.findByIdAndUpdate(req.params.id, req.body)
        // question.question = req.body.question
        // question.description = req.body.description
  
        // await question.save() ;
       res.redirect(`/question/${question._id}`)
    }
}   

module.exports = {
    addQuestion,
    showQuestion,
    addAnswer,
    deleteQuestion,
    deleteAnswer,
    editQuestion,
    editAnswer
}