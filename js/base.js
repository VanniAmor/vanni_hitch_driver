//axios请求拦截器
axios.interceptors.request.use( config => {
	if(localStorage.getItem('token_driver')){
		config.headers['Authorization'] = localStorage.getItem('token_driver')
	}
	config.headers['Accept'] = "application/vnd.lumen.driver+json"
	return config;
}, error => {
	console.log(error)
	Promise.reject(error)
}); 


//axios响应拦截器
axios.interceptors.response.use((response) => {
	// 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
	var token = response.headers.authorization
	if (token) {
		// 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
		localStorage.setItem('token_driver',token)
	}
	return response
}, (error) => {
	switch (error.response.data.code) {
		// 如果响应中的 http code 为 401，那么则此用户可能 token 失效了之类的，我会触发 logout 方法，清除本地的数据并将用户重定向至登录页面
		case 401:
			localStorage.removeItem('token_driver')
			mui.toast('网络错误,请重新登录');
			setTimeout(goToPages('../index.html'),2000)
			plus.nativeUI.closeWaiting()
			break
		// 如果响应中的 http code 为 400，那么就弹出一条错误提示给用户
		case 400:
			mui.toast('网络错误,请重新登录');
			localStorage.removeItem('token_driver')
			setTimeout(goToPages('../index.html'),3000)
			plus.nativeUI.closeWaiting()
			break
		default:
			mui.toast(error.response.data.message)
			plus.nativeUI.closeWaiting()
			break;
	}
	return Promise.reject(error)
});

//页面跳转
function goToPages(page){
	mui.openWindow({
	url:page,
		id:page,
		createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		waiting:{
		  autoShow:true,//自动显示等待框，默认为true
		  title:'正在加载...',//等待对话框上显示的提示内容
		}
	})
}

//发送get请求
function ajax_get(header,url,data,success){
	var ajax = new XMLHttpRequest();
	//设置header信息
	Object.keys(headers).foreach(function(header){
		console.log(header,headers[header]);
		xhr.setRequestHeader(header,headers[header]);
	})
	//步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url
	ajax.open('get',url+data);
	//步骤三:发送请求
	ajax.send();
	//步骤四:注册事件 onreadystatechange 状态改变就会调用
	ajax.onreadystatechange = function () {
	   if (ajax.readyState==4 &&ajax.status==200) {
		//步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
	　　　　console.log(ajax.responseText);//输入相应的内容
  　　}}
  }
	
//发送post请求
function ajax_post(headers,url,data,success){
	//创建异步对象  
	var xhr = new XMLHttpRequest();
	//设置请求的类型及url
	//post请求一定要添加请求头才行不然会报错
	Object.keys(headers).foreach(function(header){
		console.log(header,headers[header]);
		xhr.setRequestHeader(header,headers[header]);
	})
	var dataString = '';
	Object.keys(data).foreach(function(key){
		if(dataString != ''){
			dataString += "&" + key + "=" + data[key]
		}else{
			dataString = key + "=" + data[key]
		}
	})
	xhr.open('post', url );
	//发送请求
	xhr.send(dataString);
	xhr.onreadystatechange = function () {
		// 这步为判断服务器是否正确响应
	  if (xhr.readyState == 4 && xhr.status == 200) {
		console.log(xhr.responseText);
	  }
	};
}