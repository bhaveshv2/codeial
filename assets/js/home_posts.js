{
    //method to submit the form data for the new post using AJAX
    let createPost = function(){
        let newPostForm =  $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();                         //prevent it from the default behaviour of submit i.e.,not submit the behaviour of the button and refreshing the webpage.

            //this request is send and recieve in post_controller
            $.ajax({
                type:'post',
                url:'/posts/create',
                data: newPostForm.serialize(),              //sending data and serialize means to convert the form data into json (content part is key and value is in the form given bu user)

                success:function(data){
                   
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button>a',newPost));

                    $('#post-container').css("background-color","white");
                    // call the create comment class
                    new PostComments(data.data.post._id);

                    //enable the functionality of the toggle  like button on the post
                    new ToggleLike($(' .toggle-like-button',newPost));
                    
                    new ToggleUnlike($(' .toggle-unlike-button',newPost));

                    new Noty({
                        theme:'relax',
                        text:"Post Published!",
                        type:'success',
                        layout:'topRight',
                        timeout:1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responeText);
                }
            })
        });
    }


    //method to create a post in DOM
    let newPostDom= function(post){
        //show the 0 likes on this post
        return $(`<div id="post-${post._id}">
                    <div id="post-container">
                        <div>
                            <div id="post-content"> 
                                ${post.content}
                            </div>
                            <br>
                            <div id="post-username">
                                ${ post.user.name}
                                <p>${ post.createdAt}</p>
                            </div>
                        </div>
                        <br>
                        <div class="post-comments">
                            <form action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type here to add comment...">
                                <input type="hidden" name="post" value="${ post._id}">
                                <input type="submit" value="Add Comment">
                            </form>
                        </div>
                        <div id="delete-like-container">
                            <div id="like-container>
                                <a class="toggle-like-button" href="/likes/toggle/?id=${post._id}&type=Post" data-likes="0">
                                    0 <i class="fas fa-thumbs-up"></i>
                                </a>
                                <a class="toggle-unlike-button" href="/unlikes/toggle-unlike/?id=${post._id}&type=Post" data-unlikes="0">
                                    0 <i class="fas fa-thumbs-down"></i>
                                </a>
                            </div>
                            <div id="delete-container">
                                <div class="delete-post-button">
                                    <a href="/posts/destroy/${post._id}"><i class="far fa-trash-alt"></i></a>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="post-comment-lists">
                            <div id='post-comments-${ post._id}'>
                            </div>
                        </div>
                    </div>
                </div>`)
    }


    //method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme:'relax',
                        text:"Post deleted!",
                        type:'success',
                        layout:'topRight',
                        timeout:1500
                    }).show();
                },
                error:function(error){
                    console.log(error.responeText);
                }
            });
        });
    }

    //whenever the page refreshes or load for the first time loop over all the existing posts on the page and call the deletePost method on delete link of each,also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>div').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button>a',self);
            deletePost(deleteButton);
        
            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    }

    
    createPost();
    convertPostsToAjax();
}