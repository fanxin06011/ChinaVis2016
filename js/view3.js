(function(){
	
	
	
	function View3(Observer){
		var num=1;
		
		var view3={};
		var width=$("div#view3").width();
		var height=$("div#view3").height();
		var iplistpre=[];
		var iplist=[];
		var ipaddlist=[];
		var ipdeleted=-1;;
		var delflag=0;//0-del 1-not del
		var adddelflag=0;//add-0 del-1
		var iphighlight=[];
		var numlimit=50;
		
		var ipdataAll;
		var totalip;

		d3.csv("./data/Uqip.csv",function(error,data){
			ipdataAll=data;
			totalip=ipdataAll.length;
		});

		
		$("#view3load").click(function(){
			console.log("view3load");
		    $("#file").click();
		 });
		$("#view3back").click(function(){
		   console.log("back");
		   redraw(iplistpre);
		   /*
		   if(adddelflag==0){
			   redraw(iplistpre);
		   }else{
			   redraw(_.union(iplist,[ipdeleted]));
			   delflag=1;
		   }*/
		   
		 });
		$("#view3retry").click(function(){
		   console.log("forth");
		   redraw(iplist);
		   /*
		   if(adddelflag==0){
			   redraw(iplist);
		   }else{
			   redraw(_.without(iplist,ipdeleted));
			   delflag=0;
		   }*/
		   
		 });
	    
	  
	    $("#view3clear").click(function(){
		    iplist=[];
		    ipaddlist=[];
		    iphighlight=[];
		    $("#view3inner").children("p").remove();
		    Observer.fireEvent("highlight", [], "view3");
		});
		
		function highlight(dt){
			var hltmp=_.filter(iphighlight,function(d){
				return _.indexOf(dt,d)>=0;
			});
			Observer.fireEvent("highlight", hltmp, "view3");
		}
		
		function redraw(dd){  
		  Observer.fireEvent("chooseip", dd, "view3");
		  $("#view3inner").children("p").remove();
		  //console.log(iphighlight);
		  for(var m=0;m<dd.length;m++){
			  var tmp=ipdataAll[parseInt(dd[m])].IP;
			  $("#view3inner").append("<p>"+tmp+"("+dd[m]+")"+"</p>");
			  $("#view3inner p:last").attr("id","view3p"+dd[m]);
			  $("#view3inner p:last").css("background-color",function(){
				  //console.log(dd[m]);
				  if(_.indexOf(iphighlight,parseInt(dd[m]))>=0){
					  return "pink";
				  }else{return "white";}
			  });
			  $("#view3inner p:last").addClass("idlistp");
			  $("#view3inner p:last").append('<a class="deleteid"><i class="fa fa-remove "></i></a>');
			  //$("#view3inner p:last").append("g").append("title").text("id:"+dd[m]);
			  
			  $(".deleteid:last").click(function(){
				    adddelflag=1;

				    var t0=$(this).parent("p").attr("id");
				    var t=parseInt(t0.split("p")[1]);
					//console.log(iplist);
					//ipdeleted=t;
					$(this).parent("p").remove();
					iplist=_.without(iplist,t);
					//console.log(iplist);
					iplistpre=_.without(iplistpre,t);
					if(_.indexOf(iphighlight,t)>=0){
						iphighlight=_.without(iphighlight,t);
						highlight(dd);
					}
					
				});
			  $("#view3inner p:last").click(function(){
				  var t0=$(this).attr("id");
				  var t=parseInt(t0.split("p")[1]);

				  if(($(this).css("background-color")=="pink")||($(this).css("background-color")=="rgb(255, 192, 203)")){
					  $(this).css("background-color","white");
					  iphighlight=_.without(iphighlight,t);
					  highlight(dd);
				  }else{
					  $(this).css("background-color","pink");
					  iphighlight=_.union(iphighlight,[t]);
					  highlight(dd);
				  }
				  
			  });
		  }
		}
	
		function saveAs(blob, filename) {
			var type = blob.type;
			var force_saveable_type = 'application/octet-stream';
			if (type && type != force_saveable_type) { 
				var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
			}

			var url = URL.createObjectURL(blob);
			var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = url;
			save_link.download = filename;

			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
			URL.revokeObjectURL(url);
		}
		
		
		$("#view3save").click(function(){
			var iparrtmp=[];
			for(var i=0;i<iplist.length;i++){
				iparrtmp.push(ipdataAll[iplist[i]].IP);
			}
			var textBlob1 = new Blob([iparrtmp.toString()], { type: "text/plain"});
			saveAs(textBlob1,num+'.txt');
			num=num+1;
		});

		view3.onMessage = function(message, data, from){
			if(message == "addip"){
				if(from == "view2"){
					
					
					console.log(data);
					adddelflag=0;
					iplistpre=iplist;
					ipaddlist=data;
					iplist=_.union(ipaddlist,iplistpre);
					redraw(iplist);
				}
			}

		}
		Observer.addView(view3);
		return view3;
		
	}
	window["View3"] = View3;
})()