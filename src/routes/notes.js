const router = require('express').Router();
//Models
const Note = require('../models/Note');

//New Note
router.get('/notes/add',(req,res)=>{
    res.render('notes/new-note')
});


router.post('/notes/new-note', async (req,res) =>{
    const {title, description} = req.body;
    const errors = [];
    if (!title){
        errors.push({text: 'Please write a title'})
    }
    if (!description){
        errors.push({text: 'Pleasae write a description'})
    }

    if(errors.length > 0){
        res.render('notes/new-note', {errors, title, description})
    } else {
        const newNote = new Note({title,description});
        await newNote.save();
        req.flash('success_msg', 'Note added Successfully');
        res.redirect('/notes')
 
    }
})

//get All Notes
router.get('/notes',async(req,res)=>{
    const notes = await Note.find().sort({date:'desc'});
    res.render('notes/all-notes',{notes})
});

//Edit Notes
router.get('/notes/edit/:id', async (req,res)=>{
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-note', {note})
})

//Delete Notes
router.delete('/notes/delete/:id', async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('error_msg','Note deleted :(')
    res.redirect('/notes')
})


//Method PUT
router.put('/notes/edit-note/:id', async (req,res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title, description});
    req.flash('success_msg','Note updated successfully')
    res.redirect('/notes');
})

module.exports = router;