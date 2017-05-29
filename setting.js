 var R = 35;
 var PointLocationArr = [];
 var RecordPassword = [];//记录数据
 var RecordPassword1 = [];//记录第一组数据
 var RecordPassword2 = [];//记录第二组数据
 var SelectedPoint = [];
 
//record point location in PointLocationArr 
 function PointLotion(diffX, diffY) 
 {
    PointLocationArr = [];
    for (var row = 0;row < 3;row ++) 
    {
      for (var col = 0;col < 3;col ++) 
      {
          var Point = {X:(col*diffX+(col*2+1)*R),Y:(row*diffY+(row*2+1)*R)};
          PointLocationArr.push(Point);
      }
    }
    return PointLocationArr;
  }
// circle initialization
  function DrawCircle(cxt,PointLocation)
  {
    for (var i = 0; i < PointLocation.length; i++)
   {
      var Point = PointLocation[i];
      cxt.strokeStyle = "#000000";
      cxt.lineWidth = 4;
      cxt.beginPath();
      cxt.arc(Point.X,Point.Y,R,0, 2*Math.PI,true);
      cxt.closePath();
      cxt.stroke();
    }
  }
// touch point
 function IsPointSelect(touches,LinePoint)
  {
    for (var i = 0; i < PointLocationArr.length; i++)
     {
        var currentPoint = PointLocationArr[i];
        var xdiff = Math.abs(currentPoint.X - touches.pageX);
        var ydiff = Math.abs(currentPoint.Y - touches.pageY+offsetTop);
        var dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        if (dir < R ) 
        {
             if(LinePoint.indexOf(i) < 0)
                { 
                    LinePoint.push(i); //which point
                    SelectedPoint.push(PointLocationArr[i]);//record touched point location
                }
        }
      }           
  }
//fill selected circle
 function DrawSelectedCircle(cxt,PointSelectedLocation)
    {
      for (var i = 0; i < PointSelectedLocation.length; i++)
     {
        var Point = PointSelectedLocation[i];
        cxt.strokeStyle = "#000000";
        cxt.fillStyle = "#FFFF00";
        cxt.beginPath();
        cxt.arc(Point.X,Point.Y,R,0, 2*Math.PI,true);
        cxt.closePath();
        cxt.fill();
        cxt.stroke();
       }
    }
//draw line
 function DrawLine(cxt,LinePoint)
 {
        cxt.beginPath();
        cxt.lineWidth = 3;
       for(var i = 0;i < LinePoint.length;i ++)
       {
            var pointIndex = LinePoint[i];
            cxt.lineTo(PointLocationArr[pointIndex].X, PointLocationArr[pointIndex].Y);
        }
         cxt.strokeStyle = "#FF0000";
         cxt.stroke();
         cxt.closePath();    
 }
//set password 
 function SetPassword(canvasContainer, cxt) 
 {
      var LinePoint = [];
      RecordPassword = [];
      RecordPassword1 = [];
      RecordPassword2 = [];
      document.getElementById("check").checked = false;
        canvasContainer.addEventListener("touchstart", function (e) {
            IsPointSelect(e.touches[0],LinePoint);
         }, false);
        canvasContainer.addEventListener("touchmove", function (e) {
             e.preventDefault();  //阻止滚动
             IsPointSelect(e.touches[0],LinePoint);   
             cxt.clearRect(0,0,CW,CH);  //删除画布的矩形区域并且用一个透明的颜色填充它
             DrawCircle(cxt, PointLocationArr);
             DrawSelectedCircle(cxt,SelectedPoint);
             DrawLine(cxt,LinePoint);
         }, false);
         canvasContainer.addEventListener("touchend", function (e) {
            cxt.clearRect(0,0,CW,CH);
            DrawCircle(cxt, PointLocationArr);
            DrawSelectedCircle(cxt,[]);
            DrawLine(cxt,[]);
            RecordPassword = LinePoint.slice(0);     
            LinePoint = [];
            SelectedPoint = [];   
            SetState();         
        }, true);        
}
function SetState(){
           if (document.getElementById("set").checked == true) {
                localStorage.clear();
               if(RecordPassword.length > 0 && RecordPassword.length < 5)
                 {
                     document.getElementById("showtip").value="密码太短，至少需要5个点";
                     RecordPassword = [];
                     RecordPassword1 = [];
                     RecordPassword2 = [];
                 }
                 else
                  {
                    document.getElementById("showtip").value = "请再次输入手势密码";  
                    if (RecordPassword1.length == 0)
                       {
                         RecordPassword1 = RecordPassword.slice(0);
                         RecordPassword = [];
                       }       
                       else
                        if (RecordPassword1.length > 0)
                       {
                          RecordPassword2 = RecordPassword.slice(0);
                          RecordPassword = [];
                          if(RecordPassword1.toString()!= RecordPassword2.toString()) 
                          {
                              document.getElementById("showtip").value="两次密码输入不一致";
                              RecordPassword = [];
                              RecordPassword1 = [];
                              RecordPassword2 = [];
                          }
                          else 
                            if(RecordPassword1.toString() == RecordPassword2.toString() && RecordPassword2.length > 0)
                            {
                              document.getElementById("showtip").value = "密码设置成功"; 
                              if (window.localStorage) {
                                        localStorage.setItem("pswdvalue", RecordPassword2);  
                                    } else {
                                        Cookie.write("pswdvalue", RecordPassword2);  
                                    }
                              RecordPassword1 = [];
                              RecordPassword2 = [];              
                            }
                       } 
                    }
         }
            else
                 if (document.getElementById("check").checked == true) {
                        if (localStorage.length == 0) 
                            {
                              document.getElementById("showtip").value = "尚未设置密码";
                              document.getElementById("set").checked = true;
                              document.getElementById("check").checked = false;
                              }
                       if(localStorage.getItem("pswdvalue") == RecordPassword.toString() && localStorage.length > 0)
                           {
                             document.getElementById("showtip").value="密码正确";
                              RecordPassword = [];
                           }
                           else
                            if(localStorage.getItem("pswdvalue") != RecordPassword.toString() && localStorage.length > 0)
                           {
                             document.getElementById("showtip").value="输入的密码不正确";
                              RecordPassword = [];                  
                           }
                       }
}
//onload event
window.onload = function () 
{
    var drawing = document.getElementById("figuredraw");
    if(drawing.getContext)
    {
        CW = document.body.offsetWidth * 0.8;
        CH = document.body.offsetHeight * 0.9;
        offsetTop = drawing.offsetTop;
        drawing.width = CW;
        drawing.height = CH;
        var cxt = drawing.getContext("2d");
        //两个圆之间的外距离 就是说两个圆心的距离减去两个半径
        var X = (CW-R*2*3)/2;
        var Y = (CH-R*2*3)/2;
        PointLocationArr = PointLotion(X, Y);
        DrawCircle(cxt, PointLocationArr); 
        SetPassword(drawing,cxt);       
    }
}
