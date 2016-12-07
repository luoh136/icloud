var app=angular.module('icloud',[]); 
//$scope.$watch()  $scope.$digest() 
//controller 内部的函数操作或赋值操作会隐式调用 $scope.$digest()
//delete  e.keyCode===8

//自定义指令  
app.directive("ngLi",[function(){
	return{
		restrict:'A',
		template:'<div class="bottom"><div ng-transclude></div></div>',
		//保留原有内容
		transclude:true,
		replace:true,
		link:function($scope,el){
			$(el).on("keyup",false)
			//增加类名改变样式
			$(el).on("click",'.bottomlists',function(){
				$('.bottom').find('.bottomlists').removeClass('active');
				$(this).addClass('active');
				that=$(this).index()-1;
				$scope.$apply(function(){
					$scope.cu=that;		
				})
			});
			//存input值
			$(document).on("keyup",':input',function(){
				$scope.listSave()
			});
			//delete键 删除指定一条
			$(document).on('keyup',function(e){
				if(e.keyCode===46){
					var index=$(".bottom .active").index()-1;	
					if(index<0){
						return
					}
					$scope.$apply(function(){
						$scope.list.splice(index,1)
						$scope.listSave();					
					})
				}
			});		
		}
	}
}])
app.directive("ngSh",[function(){
	return{
		restrict:"A",
		template:'<label class="xuanx {{list[cu].theme}}">选项</label>',
		replace:true,
		link:function($scope,el){
			$(el).on("click",function(){
				$(".choice").toggleClass('active');
				return false;
			});
			$(".choice").on('click',false);
			$(document).on('click',function(){
				$(".choice").removeClass('active');
				$(".s").removeClass('active');
			});
			$('.btnleft').on('click',function(){
				$scope.$apply(function(){
					console.log($scope.cu)
					$scope.list.splice($scope.cu,1)
					$scope.listSave();
				})				
			});
			$(".rb-lis").on("click",'.s',function(){
				$('.s').removeClass('active')
				$(this).addClass('active')
				return false
			})
			
		}
	}
}])
//列表增删
app.controller('mainCtrl',['$scope',function($scope){	
	$scope.list=[
//		{id:1002,name:'已计划',theme:'red'}
	]	
	if(localStorage.reminder){
		$scope.list=JSON.parse(localStorage.reminder);
	}else{
		$scope.list=[];
	}
	$scope.cu=0
	$scope.arr=["green","yellow","red","orange","purple","brown","blue"];
	$scope.addlist=function(){
		var i=$scope.list.length%7;
	    var v={
			id:maxId()+1,
			name:"新列表 "+($scope.list.length+1),		
			theme:$scope.arr[i],
			todos:[]
		};
		$scope.list.push(v)
	}
	
	$scope.addItem=function(){
		var i={
			state:0,
			val:""
		}
		$scope.list[$scope.cu].todos.push(i)
	}
	$scope.finishclear=function(){
		var arr=[];
		$scope.list[$scope.cu].todos.forEach(function(v,i){	
			if(v.state!=1){
				arr.push(v);
			}
			$scope.list[$scope.cu].todos=arr;
		})
	}
	$scope.fi=function(){
		var b=0;
		$scope.list[$scope.cu].todos.forEach(function(v,i){
			if(v.state===1){
				b++
			}
		})
		return b;
	}
	$scope.listSave=function(){
		localStorage.reminder=JSON.stringify($scope.list)
	}
	//console.log(localStorage.reminder)
	function maxId(){
		var max=-Infinity;
		for(var i=0;i<$scope.list.length;i++){
			if($scope.list[i].id>max){
				max=$scope.list[i].id;
			}
		}
		return  max=(max===-Infinity)?1000:max
	}
	
}])
