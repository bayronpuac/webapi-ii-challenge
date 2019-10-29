const express = require('express');
const db = require('../data/db');
const router = express.Router();


//GET
router.get('/', (req, res) => {
  
    db.find(req.query)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({ 
            error: "The posts information could not be retrieved." 
        });
      });
  });
//GET BY ID
  router.get('/:id', (req, res) => {
    db.findById(req.params.id)
      .then(posts => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ message: 'Post not found' });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the Post',
        });
      });
  });

//GET BY ID AND COMMENTS
  router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
      .then(comments => {
        if (comments) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ message: 'Comm not found' });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the Post',
        });
      });
  });

  //POST 
router.post('/', (req, res) => {
    const postInfo = req.body;
    if( !postInfo.title || !postInfo.contents){
        res.status(400).json({
            errorMessage: "Please provide title and contents from the post"
        });
    } else {
        db.insert(postInfo)
        .then( post => {
            res.status(201).json(post)
        })
        .catch(() => {
            res.status(500).json({
             errorMessage:
               'There was an error while saving the user to the database',
           });
         });
    }
});
//POST BY ID AND COMMENTS
router.post('/:id/comments', async(req,res) => {
    const comtext = req.body.text;
    const id = req.params.id;
    try {
       const commentInfo = await db.findById(req.params.id);
       if(commentInfo == []){
         res.status(404).json({error: "The post with the specific ID does not exist."})
       }else if (!comtext){
          res.status(400).json({error: "Please provide text for the comment"})
       }else {
         await db.insertComment({...req.body, post_id:id});
         res.status(201).json(comtext)
       }
       }catch (error){
         res.status(500).json({error: "There was an error while saving the comment to the database."})
       }
    });
//DELETE
  router.delete("/:id", (req, res) => {
    db
      .remove(req.params.id)
      .then(count => {
        if (count > 0) {
            res.status(200).json({ message: 'The post has been nuked' });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          error: "The post could not be removed"
        });
      });
  });

//PUT WITH ID
  router.put("/:id", (req, res) => {
    if (!req.body.title || !req.body.contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
    } else {
      db
        .update(req.params.id, req.body)
        .then(post => {
          if (post) {
            res.status(200).json(req.body);
          } else {
            res.status(404).json({
              message: "The post with the specified ID does not exist."
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "The post information could not be modified."
          });
        });
    }
  });

  

module.exports = router;