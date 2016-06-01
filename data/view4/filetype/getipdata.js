 
function getdata(){
    var id=20301;//被选中的ip的id号
    var flag=1;//0-作为srcip 1-作为dstip
    var url="ipdata.php";
    url=url+"?ipselected="+id+"&SrcOrDst="+flag;

    $.ajax({ 
        url:url, 
        success:function(data){ 
            console.log(data);
            //data.cnt[i][j] : 第i（0-52）天第j（0-23）个小时的次数
            //draw matrix
        },
        error:function(xhr){
          console.log("error");
        } 
    })
 }