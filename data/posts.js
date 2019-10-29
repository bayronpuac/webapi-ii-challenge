const express = require('express');
const db = require('../data/db');
const router = express.Router();

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


router.post("/:id/comments", (req, res) => {
    if (!req.body.text) {
      res.status(400).json({
        errorMessage: "Please provide text for the comment."
      });
    } else {
      db
        .insertComment(req.body)
        .then(comment => {
          if (comment) {
            res.status(201).json(req.body);
          } else {
            res.status(404).json({
              message: "The post with the specified ID does not exist."
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });

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