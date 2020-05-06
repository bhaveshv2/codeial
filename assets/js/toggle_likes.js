class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                let unlikesCount = parseInt($(self).attr('data-unlikes'));
                // console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    unlikesCount += 1;
                    $(self).css('color','black');
                }else{
                    likesCount += 1;
                    unlikesCount -= 1;
                    $(self).css('color','blue');
                }

                $(self).attr('data-likes', likesCount);
                $(self).attr('data-unlikes', unlikesCount);
                $(self).html(`${likesCount} <i class="fas fa-thumbs-up"></i>`);
                $(self).html(`${unlikesCount} <i class="fas fa-thumbs-down"></i>`);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });
    }
}
