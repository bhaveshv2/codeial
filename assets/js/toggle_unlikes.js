class ToggleUnlike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleUnlike();
    }


    toggleUnlike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let unlikesCount = parseInt($(self).attr('data-unlikes'));
                if (data.data.deletedUnlike == true){
                    unlikesCount -= 1;
                    $(self).css('color','black');
                }else{
                    unlikesCount += 1;
                    $(self).css('color','blue');
                }

                $(self).attr('data-unlikes', unlikesCount);
                $(self).html(`${unlikesCount} <i class="fas fa-thumbs-down"></i>`);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });
    }
}
