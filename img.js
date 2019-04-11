const sharp = require('sharp')

module.exports = {
    size: '',
    file: '',

    small: function(img) {
        this.file = sharp(img).resize({ height: 100 })
        this.size = '-small';
        return this
    },

    mid: function(img) {
        this.file = sharp(img).resize({ height: 500 })
        this.size = '-mid';
        return this
    },

    big: function(img) {
        this.file = sharp(img).resize({ height: 1000 })
        this.size = '-big';
        return this
    },

    save: function(name) {
        if(this.file){
            
            this.file.toFile('./public/upload/'+name+ this.size+'.png', (err, info) => { 
                
                console.log(err, info)
             })
        }
        return this
    },

}