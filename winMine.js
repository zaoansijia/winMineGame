/*===================================
 * fileName: winMine.js
 * author: Anan
 * version: 1.0
 * description: winMineGame plugin
 ===================================*/
(function($){
    $.winMine=function(setting){
        new $.winMine.prototype.init(setting);
    }
    $.winMine.defaults = {
        rows : '9',
        cells : '9',
        mineNum : '10',
        content : 'table'
    }
    $.winMine.prototype = {
        init: function ( setting ) {
            this.setting = $.extend( {}, $.winMine.defaults, setting );
            $.mine=this;
            rows = this.setting.rows;
            cells = this.setting.cells;
            mNum = this.setting.mineNum;
            board=[];
            if(rows<9||cells<9){
                alert('最少行列为9x9,请从新设置');
                return;
            }
            this.setTable( rows, cells, this.setting.content );
            this.setMine( rows , cells, mNum);
            $('table').find('td').on( 'click' , function() {
                $.mine.clickFun($(this));
            });
        },
        setMine : function ( row,cell,mNum ) {
            var num=0;
            //declare a array to record the 'mine' and init the mine cxt '0'
            for( var i=0 ; i<(row+2) ; i++ ) {
                board[i]=[];
                for( var j=0; j<(cell+2); j++ ) {
                    board[i][j] = 0;
                }
            };

            //fill 'mine'
            do {
                var x = 1+Math.round(Math.random()*(row-1));//random a num to represent the rows;
                var y = 1+Math.round(Math.random()*(cell-1));//random a num to represent the columns;
                if( board[x][y]==0 ) {
                    board[x][y]="mine";
                    num+=1;
                }
            } while(num<=mNum);

            //show the number of mine
            for( var i=1; i<(row-1); i++ ) {
                for( var j=1; j<(cell-1); j++ ) {

                    var nums=0//to account the number of 'mine'
                    if( board[i][j]!='mine' ) {
                        var sqr=this.setCoordinate(i,j);
                        for( var k=0; k<sqr.length; k++ ) {
                            if( board[sqr[k].x][sqr[k].y]=='mine') nums+=1;
                        }

                        board[i][j]=nums;
                    }
                }
            }
        },

        clickFun : function ( obj ) {

            var data = obj.attr('id').split('_');
            var x = parseInt(data[0]);
            var y = parseInt(data[1]);
            var reNum = parseInt($('table').find('td').length-$('.not').length);

            obj.text( board[x][y] ).css('boxShadow','none');

            //game over
            if( obj.text()=='mine' ) {
                obj.addClass('shot').css('boxShadow','none').text('');
                alert('game over!!!');

                for( var i=1;i<(rows+1);i++ ) {
                    for( var j=1;j<(cells+1);j++ ) {

                        $("#"+i+"_"+j+"").text(board[i][j]).css('boxShadow','none');
                        if( board[i][j]=='mine' ) {
                            $("#"+i+"_"+j+"").addClass('init_swiper').css('boxShadow','none');
                        }
                    }
                };

                $('.init_swiper').addClass('shot').text('');
                return false;
            }
            obj.addClass('not');

            //got it
            if( reNum==mNum ) alert('you are superman');

            if(board[x][y]==0) this.showText(obj);
        },
        showText : function (obj) {

            var data = obj.attr('id').split('_');
            var x = parseInt(data[0]);
            var y = parseInt(data[1]);
            var sqr = this.setCoordinate(x,y);

            for( var i=0; i<sqr.length; i++ ) {
                var td=$("#"+sqr[i].x+"_"+sqr[i].y+"");

                if( sqr[i].x>=1 && sqr[i].x<=rows && sqr[i].y>=1 && sqr[i].y<=cells ) {
                    if( td.text()=='' ) {
                        td.text( board[sqr[i].x][sqr[i].y] ).css('boxShadow','none').addClass('not');
                        this.scanAgain(td);
                    }
                }
            }
        },
        scanAgain : function (obj) {
            if( obj.text()== '0' ) {
                this.showText(obj);
            }
        },
        setTable : function (row,cell,cont) {
            var table='';

            for( var i=1 ; i<=row ; i++ ) {
                table += "<tr>";
                for( var j=1 ; j<=cell ; j++ ) {
                    table += "<td id="+i+'_'+j+"></td>";
                }
                table += "</tr>"
            }
            $('#'+cont).append(table);

        },
        setCoordinate : function ( x,y ) {
            var sqr=[
                {'x':(x-1),'y':(y-1)},//top_left
                {'x':(x-1),'y':y},//top_middle
                {'x':(x-1),'y':(y+1)},//top_right
                {'x':x,'y':(y-1)},//middle_left
                {'x':x,'y':(y+1)},//middle_right
                {'x':(x+1),'y':(y-1)},//bottom_left
                {'x':(x+1),'y':y},//bottom_middle
                {'x':(x+1),'y':(y+1)},//bottom_right

            ];
            return sqr;
        }

    }

    $.winMine.prototype.init.prototype = $.winMine.prototype;
})(jQuery);


