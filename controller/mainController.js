const questionModel =  require('../model/questionModel')

// const errorPage = (req, res) => {
//     res.render('404')
// }

const getHomepage = async (req, res) => {
    const question = await questionModel.find().populate('user').sort({ createdAt: -1 });
    res.render('homePage',{question})
}

module.exports = {
    getHomepage,
    // errorPage
}