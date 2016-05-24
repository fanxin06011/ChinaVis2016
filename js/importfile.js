function  handleFiles(files)
  {
    if(files.length)
    {
		
       var file = files[0];
       var reader = new FileReader();
       reader.onload = function()
       {
           console.log(this.result) ;
		   $("input#file").attr("ls",this.result);
		   $("input#file").attr("flag","1");
		   $("button#add").click();
       };
	   
       reader.readAsText(file);
    }
  }
