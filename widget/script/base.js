/**
 * 封装apicloud方法
 * @param {Object} window
 */
(function(window) {
	var b = {};
	//是否打印控制台信息
	var is_log = true;
	//文件操作模块
	var fs = null;
	/**
	 * 设置标题栏样式
	 */
	b.setbar_style = function(style) {
		var temp = 'light';
		if (!b.isEmpty(style)) {
			temp = 'dark';
		}
		api.setStatusBarStyle({
			style : temp
		});
	}
	/**
	 * 添加设备的keyback监听事件
	 * @param {Object} callback 监听回调函数
	 */
	b.add_keyback_evt = function(callback) {
		api.addEventListener({
			name : 'keyback'
		}, function(ret, err) {
			//coding...
			if ( typeof callback == 'function') {
				callback();
			}
		});
	}
	/**
	 * 列表页分页显示，滑到底事件监听
	 */
	b.add_scrollbottom_evt = function(callback) {
		/**
		 * 到底监听事件
		 */
		api.addEventListener({
			name : 'scrolltobottom',
			extra : {
				threshold : 0 //设置距离底部多少距离时触发，默认值为0，数字类型
			}
		}, function(ret, err) {
			if ( typeof callback == 'function') {
				callback()
			}
		});
	}
	/**
	 * 默认打开frm的方法
	 * @param {Object} path 文件路径
	 * @param {Object} y frm显示区域的y坐标
	 */
	b.open_f = function(path, pageParam, x, y, w, h, reload, showProgress) {
		var name = b.getFileName(path);
		api.openFrame({
			name : name,
			url : path,
			reload : reload ? reload : false,
			showProgress : showProgress ? showProgress : false,
			pageParam : pageParam,
			rect : {
				x : 0,
				y : y == undefined ? 0 : y,
				w : w == undefined ? api.winWidth : w,
				h : h == undefined ? 'auto' : h
			}
		});
		return name
	}
	/**
	 * 打开半透明弹出层
	 * @param {Object} path 文件路径
	 * @param {Object} pageParam 传递参数
	 * @param {Object} animation 动画类型
	 */
	b.open_layer_f = function(path, pageParam, animation, reload) {
		var name = b.getFileName(path);
		api.openFrame({
			name : name,
			url : path,
			pageParam : pageParam,
			bgColor : 'rgba(0, 0, 0, 0.4)',
			//animation : animation,
			rect : {
				x : 0,
				y : 0,
				w : api.winWidth,
				h : 'auto'
			},
			reload : $base.isEmpty(reload) ? false : reload
		});
	}
	b.open_layer_no_bg = function(path, pageParam, animation, reload) {
		var name = b.getFileName(path);
		api.openFrame({
			name : name,
			url : path,
			pageParam : pageParam,
			bgColor : 'rgba(0, 0, 0, 0)',
			//animation : animation,
			rect : {
				x : 0,
				y : 0,
				w : api.winWidth,
				h : 'auto'
			},
			reload : $base.isEmpty(reload) ? false : reload
		});
	}
	/**
	 * 打开win
	 * @param {Object} path 文件路径
	 */
	b.open_w = function(path, setting) {
		var name = b.getFileName(path);
		var reload = (setting == undefined || setting.reload == undefined) ? false : setting.reload;
		var slidBackEnabled = (setting == undefined || setting.slidBackEnabled == undefined) ? true : false;
		var pageParam = null;
		if (setting != undefined) {
			pageParam = setting.pageParam;
		}
		api.openWin({
			name : name,
			url : path,
			reload : reload,
			slidBackEnabled : slidBackEnabled,
			pageParam : pageParam
		});
	}
	/**
	 * 关闭刷新指定的界面
	 * @param {Object} name 刷新的win的name
	 * @param {Object} frmName 刷新的frmName的name 不能为null ,可以为""
	 * @param {Object} funName 回调函数的方法名称
	 * @param {Object} params 回调函数对应的参数
	 * @param {Object} isclose 是否关闭当前win
	 */
	b.close_r = function(name, frmName, funName, params, isclose) {
		if ( typeof params == 'object') {
			b.show_t("关闭回调函数参数不能是对象");
			return;
		}
		api.execScript({
			name : name,
			frameName : frmName,
			script : '' + funName + '("' + params + '");'
		});
		if (isclose)
			b.close_w();
	}
	/**
	 * 关闭指定win，如果没有设置name则关闭当前的win
	 * @param {Object} name 指定的win的name
	 */
	b.close_w = function(name) {
		if (b.isEmpty(name))
			api.closeWin({
			});
		else
			api.closeWin({
				name : name
			});
	}
	/**
	 * 关闭指定win，关闭前显示对应的提示信息
	 * @param {Object} name 指定的win的name
	 * @param {Object} msg 关闭win之前的提示信息
	 * @param {Object} location 提示信息显示的位置
	 */
	b.close_msg_w = function(name, msg, location) {
		b.show_t(msg, location)
		setTimeout(function() {
			b.close_w(name)
		}, 500)
	}
	/**
	 * 关闭指定frm
	 * @param {Object} name 指定的frm的name
	 */
	b.close_f = function(name) {
		api.closeFrame({
			name : name
		});
	}
	/**
	 * 关闭当前window和指定window之间的所有windonw
	 * @param {Object} winName 指定的win的name
	 */
	b.close_to_win = function(winName) {
		api.closeToWin({
			name : winName
			//			animation : {
			//				type : 'push',
			//				subType : 'from_bottom',
			//				duration : 500
			//			}
		});
	}
	/**
	 * 是否手机号码
	 * @param {Object} v 参数
	 */
	b.isMobile = function(v) {
		var reg = /^1[3|4|5|7|8]\d{9}$/;
		if (reg.test(v)) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 判断传递的参数是否为空
	 * @param {Object} param 参数
	 */
	b.isEmpty = function(param) {
		if ( typeof param == 'undefined' || typeof param == undefined || param == 'undefined' || param == undefined || param == null || param == "" || value == "null" || value == "(null)" || value == 'NULL') {
			return true;
		}else{
			param = param + "";
			param = param.replace(/\s/g, "");
			if(param == ""){
				return true
			}
		}
		return false;		
	}
	/**
	 * 获取值
	 * @param {Object} param 参数
	 * @param {Object} param 参数
	 */
	b.setValue = function(value, defaultval) {
		return b.isEmpty(value) ? defaultval : value;
	}
	/**
	 * 判断一个对象是否是数组
	 * @param {Object} param 参数
	 */
	b.isArray = function(param) {
		if (b.isEmpty(param))
			return false;
		if ( typeof param != 'object' || typeof param.length == 'undefined' || typeof param.length == undefined)
			return false;
		return true;
	}
	/**
	 * 判断对象是否为空
	 */
	b.isObjEmpty = function(obj) {
		if (b.isArray(obj)) {
			return obj.length == 0
		} else if ( typeof obj == 'object') {
			//是对象，但不是数组
			var isEmpty = true
			for (var key in obj) {
				if (key && obj[key]) {
					isEmpty = false
					break
				}
			}
			return isEmpty
		}
		return true
	}
	/**
	 * 是否是小数
	 */
	b.isfloatNum = function(s) {
		var regu = String(Number(s))
		console.log(regu)
		if (regu.indexOf('.') >= 0) {
			return true
		}
		return false
	}
	/**
	 * 如果含有小数就保留两位小数位，小数位全为0的默认是整数不保留小数位
	 */
	b.getNumberVal = function(num) {
		if (isNaN(num)) {
			$base.show_c("setNumberVal", "非纯数字")
			return -404
		}
		if (b.isfloatNum(num)) {
			return Number(num).toFixed(2)
		} else {
			return Number(num)
		}
	}
	/**
	 * 根据attrs属性集合，判断是否存在相似的json对象，如果存在就不添加，反之加入
	 * @param {Object} data json数组
	 * @param {Object} json 即将被添加的元素
	 * @param {Object} attrs json属性集合
	 */
	b.push = function(data, json, attrs, count) {
		if (b.isArray(data)) {
			if (!b.isArray(attrs)) {
				data.unshift(json);
				return;
			}
			var d_index = -1;
			for (var i = 0; i < data.length; i++) {
				var isequal = true;
				for (var j = 0; j < attrs.length; j++) {
					if (data[i][attrs[j]] != json[attrs[j]]) {
						isequal = false;
						break;
					}
				}
				if (isequal) {
					d_index = i;
					break;
				}
			}
			if (d_index != -1) {
				data.splice(d_index, 1);
			}
			data.unshift(json);
		} else {
			data.unshift(json);
		}
		if (count && count > 0 && count < data.length)
			data.splice(count, data.length - count);
	}
	/**
	 * 排序
	 */
	b.paixu = function(json, attr) {
		if (!attr)
			return json
		var keyArr = []
		var keyValArr = []
		for (var key in json) {
			keyArr.push(key)
			keyValArr.push(json[key][attr])
		}
		var temp = null
		var valTmp = null
		for (var i = 0; i < keyValArr.length - 1; i++) {
			for (var j = i + 1; j < keyValArr.length; j++) {
				if (Number(keyValArr[i]) < Number(keyValArr[j])) {
					temp = keyValArr[i]
					keyValArr[i] = keyValArr[j]
					keyValArr[j] = temp
					valTmp = keyArr[i]
					keyArr[i] = keyArr[j]
					keyArr[j] = valTmp
				}
			}
		}
		var arr = []
		for (var m = 0; m < keyArr.length; m++) {
			arr.push(json[keyArr[m]])
		}
		return arr
	}
	/**
	 * 显示toast提示
	 * @param {Object} msg 提示信息
	 * @param {Object} location 位置  顶部:top 中间:middle 底部:bottom
	 *
	 */
	b.show_t = function(msg, location) {
		var loc = "bottom";
		if (!b.isEmpty(location)) {
			loc = location;
		}
		api.toast({
			msg : msg,
			duration : 2000,
			location : loc
		});
	}
	/**
	 * 控制台打印信息
	 * @param {Object} tag 提示信息的标记
	 * @param {Object} message 打印信息
	 */
	b.show_c = function(tag, message) {
		if (is_log)
			console.log(tag + ":::" + message);

	}
	/**
	 * 显示进度条
	 */
	b.show_p = function() {
		api.showProgress({
			style : 'default',
			animationType : 'fade',
			title : '努力加载中...',
			text : '请稍等...',
			modal : true
		});
	}
	/**
	 * 显示提示框
	 * @param {Object} title 提示框标题
	 * @param {Object} msg 提示信息
	 * @param {Object} btnText button文本
	 * @param {Object} callback 回调函数
	 */
	b.show_a = function(title, msg, btnText, callback) {
		api.alert({
			title : title,
			msg : msg,
			buttons : [btnText]
		}, function(ret, err) {
			if (ret) {
				if ( typeof callback == 'function')
					callback();
			} else {

			}
		});
	}
	/**
	 * 弹出确认/取消框
	 * @param {Object} title 标题
	 * @param {Object} msg 确认信息
	 * @param {Object} buttons btn文本信息
	 * @param {Object} calbback 回调函数
	 */
	b.show_confirm = function(title, msg, buttons, calbback) {
		api.confirm({
			title : title,
			msg : msg,
			buttons : buttons
		}, function(ret, err) {
			if (ret) {
				calbback(ret.buttonIndex);
			} else {
			}
		});

	}
	/**
	 * 隐藏进度条
	 */
	b.hide_p = function() {
		api.hideProgress();
	}
	/**
	 * 将json对象转化成字符串
	 * @param {Object} json json对象
	 */
	b.jsonToStr = function(json) {
		return JSON.stringify(json);
	}
	/**
	 * 移除字符串中的html标签
	 */
	b.removeHtmlTag = function(str) {
		return str.replace(/<[^>]+>/g, "")
	}
	/**
	 * 获取内联框架中的doT模板
	 * @param {Object} iframeId 内联框架的主键
	 * @param {Object} tempId 模板框架
	 */
	b.getTemplateHtml = function(iframeId, tempId) {
		var templateHtml = $(window.frames[iframeId].document).find("#" + tempId).text()
		var template = doT.template(templateHtml)
		return template
	}
	/**
	 * 获取内联框架中的doT模板
	 * @param {Object} iframeId 内联框架的主键
	 * @param {Object} tempId 模板框架
	 */
	b.getJuicerTemplateHtml = function(iframeId, tempId) {
		var templateHtml = $(window.frames[iframeId].document).find("#" + tempId).text()
		return templateHtml
	}
	/**
	 * 给html元素img集合异步设置图片资源
	 * @param {Object} selector html选择器
	 * @param {Object} cla class标记
	 * @param {Object} attr img中的储存http路径的属性名
	 * @param {Object} callback 回调函数
	 *
	 */
	b.setHttpImagsSrc = function(selector, cla, attr, callback) {
		var count = 0;
		var imgs = $(selector);
		b.show_c("setHttpImagsSrc", "imgs.length=" + imgs.length);
		if (imgs.length == 0) {
			if ( typeof callback == 'function') {
				callback();
			}
			return;
		}
		for (var i = 0; i < imgs.length; i++) {
			b.syncImgSrc(imgs[i], attr, function() {
				count++;
				if (count == imgs.length) {
					if ( typeof callback == 'function') {
						callback();
					}
				}
			});
			$api.removeCls(imgs[i], cla);
		}
	}
	/**
	 * 给html元素img异步设置图片资源
	 * @param {Object} img html元素
	 * @param {Object} attr img中的储存http路径的属性名
	 * @param {Object} callback 回调函数
	 *
	 */
	b.syncImgSrc = function(img, attr, callback) {
		var url = $(img).attr(attr)
		//b.getPicSize(url)
		var isIOS = api.systemType == "ios" ? true : false;
		if (isIOS) {
			$(img).attr("src", url)
			return
		}
		//$base.show_c("syncImgSrc url", url);
		api.imageCache({
			url : url
		}, function(ret, err) {
			if (ret && ret.status) {
				//b.getPicSize(ret.url)
				$(img).attr("src", "")
				$(img).attr("src", ret.url)
				//$base.show_c("syncImgSrc 缓存本地图片路径", $(img).attr("src"));
			}
			//$base.show_c("syncImgSrc加载图片...", "ret==" + $base.jsonToStr(ret) + ";err==" + $base.jsonToStr(err));
			if ( typeof callback == 'function') {
				callback();
			}
		});
	}
	/**
	 * 给html元素img集合异步设置图片资源
	 * @param {Object} cla class标记
	 * @param {Object} url ele中的储存http路径的属性名
	 * @param {Object} cache ele中的缓存本地资源的的属性名
	 * @param {Object} callback 回调函数
	 *
	 */
	b.setHttpElesCache = function(cla, url, cache, callback) {
		var count = 0;
		var eles = $("." + cla);
		b.show_c("setHttpElesCache", "imgs.length=" + eles.length);
		if (eles.length == 0) {
			if ( typeof callback == 'function') {
				callback();
			}
			return;
		}
		for (var i = 0; i < eles.length; i++) {
			b.syncEleCache(eles[i], url, cache, function() {
				count++;
				if (count == eles.length) {
					if ( typeof callback == 'function') {
						callback();
					}
				}
			});
			$api.removeCls(eles[i], cla);
		}
	}
	/**
	 * 给html元素异步设置资源
	 * @param {Object} ele html元素
	 * @param {Object} url ele中的储存http路径的属性名
	 * @param {Object} cache ele中的储存本地缓存的属性名
	 * @param {Object} callback 回调函数
	 *
	 */
	b.syncEleCache = function(ele, url, cache, callback) {
		var httpurl = $(ele).attr(url)
		$base.show_c("syncEleCache url", httpurl);
		api.imageCache({
			url : httpurl
		}, function(ret, err) {
			if (ret && ret.status) {
				$(ele).attr("src", ret.url)
				var parent = $(ele).parent()
				$(parent).attr(cache, ret.url)
				$base.show_c("syncEleCache 缓存本地图片路径", $(ele).attr(cache));
			}
			$base.show_c("syncEleCache加载图片...", "ret==" + $base.jsonToStr(ret) + ";err==" + $base.jsonToStr(err));
			if ( typeof callback == 'function') {
				callback();
			}
		});

	}
	/**
	 * 给html元素img异步设置图片资源
	 * @param {Object} img html元素
	 * @param {Object} url http路径
	 * @param {Object} callback 回调函数
	 *
	 */
	b.syncImgSrcByUrl = function(img, url, callback) {
		$base.show_c("syncImgSrcByUrl url", url);
		api.imageCache({
			url : url
		}, function(ret, err) {
			if (ret && ret.status) {
				img.attr("src", ret.url);
				$base.show_c("syncImgSrcByUrl 缓存本地图片路径", ret.url);
			}
			$base.show_c("syncImgSrcByUrl加载图片...", "ret==" + $base.jsonToStr(ret) + ";err==" + $base.jsonToStr(err));
			if ( typeof callback == 'function') {
				callback();
			}
		});

	}
	/**
	 * 获取图片的大小
	 */
	b.getPicSize = function(url) {
		$.get(url, function(a, b, xhr) {
			//				console.log(a)
			//				console.log(b)
			console.log(xhr.getResponseHeader("Content-Length"))
			//alert(url + "$$$$$$" + xhr.getResponseHeader("Content-Length"))
		})
		//		var image = new Image();
		//		image.src = url;
		//		image.onload = function() {
		//			alert(url+"-size="+image.width+"X"+image.height);
		//		}
		//		image.onreadystatechange = function (){
		//	       if (image.readyState == "complete"){
		//		        initFileSize=image.fileSize;
		//		        var fileSize=Math.ceil(initFileSize/1024);
		//		        imgSize.innerHTML="尺寸："+img.height+"×"+img.width+" "+fileSize+"k";
		//	        }
		//    	}
	}
	/**
	 * 下载文件
	 */
	b.download = function(url, callback) {
		//alert(url)
		var splite = url.split('.')
		var fileName = b.getFileName(url) + "." + splite[splite.length - 1]
		var isIOS = api.systemType == "ios" ? true : false;
		api.download({
			url : url,
			savePath : 'fs://' + fileName,
			report : true,
			cache : true,
			allowResume : true
		}, function(ret, err) {
			if (ret.state == 1) {
				//下载成功
				if ( typeof callback == 'function') {
					callback(ret.savePath)
				}
			} else {
				if ( typeof callback == 'function') {
					callback(url)
				}
			}
		});
	}
	/**
	 * 图片缓存
	 */
	b.imageCache = function(url, callback) {
		api.imageCache({
			url : url
		}, function(ret, err) {
			var url = ret.url;
			if ( typeof callback == 'function') {
				callback(url)
			}
		});
	}
	/**
	 * 根据文件路径获取文件名称
	 * @param {Object} path 文件路径
	 */
	b.getFileName = function(path) {
		var splits = path.split('/');
		var fileName = splits[splits.length-1].split('.')[0];
		return fileName;
	}
	/**
	 * 将文件复制到fs://目录下，以便于操作
	 * @param {Object} path 当前路径
	 * @param {Object} fs_path 复制到的文件目录
	 * @param {Object} fs_file_path 复制结束的文件绝对路径
	 * @param {Object} isNewCopy 是否重新复制
	 * @param {Object} callback 回调函数
	 */
	function copyFileToFs(path, fs_path, fs_file_path, isNewCopy, callback) {
		if (fs == null) {
			fs = api.require('fs');
		}
		fs.exist({
			path : fs_file_path
		}, function(ret, err) {
			if (!ret.exist) {
				fs.exist({
					path : fs_path
				}, function(ret, err) {
					if (ret.exist) {
						if (ret.directory) {
							fs.copyTo({
								oldPath : path,
								newPath : fs_path
							}, function(ret, err) {
								console.log("复制成功");
								if ( typeof callback == 'function') {
									callback();
								}
							});
						}
					} else {
						fs.createDir({
							path : fs_path
						}, function(ret, err) {
							if (ret.status) {
								fs.copyTo({
									oldPath : path,
									newPath : fs_path
								}, function(ret, err) {
									console.log("复制成功");
									if ( typeof callback == 'function') {
										callback();
									}
								});
							} else {

							}
						});

					}
				});
			} else {
				console.log("文件已经存在");
				if (isNewCopy) {
					fs.remove({
						path : fs_file_path
					}, function(ret, err) {
						if (ret.status) {
							console.log("删除成功，开始重新复制");
							fs.copyTo({
								oldPath : path,
								newPath : fs_path
							}, function(ret, err) {
								console.log("复制成功");
								if ( typeof callback == 'function') {
									callback();
								}
							});
						} else {
							console.log(JSON.stringify(err));
						}
					});
				} else {
					if ( typeof callback == 'function') {
						callback();
					}
				}
			}
		});

	}

	/**
	 * 动态导入js文件
	 */
	b.reloadAbleJSFn = function(id, newJS,callback) {
		var oldjs = null;
		var t = null;
		var oldjs = document.getElementById(id);
		if (oldjs)
			oldjs.parentNode.removeChild(oldjs);
		var scriptObj = document.createElement("script");
		scriptObj.src = newJS;
		scriptObj.type = "text/javascript";
		scriptObj.id = id;
		scriptObj.onload = scriptObj.onreadystatechange = function() {
			if (scriptObj.readyState && scriptObj.readyState != 'loaded' && scriptObj.readyState != 'complete')
				return;
			scriptObj.onreadystatechange = scriptObj.onload = null
			if (callback)
				callback();
		}
		document.getElementsByTagName("head")[0].appendChild(scriptObj);
	}
	/**
	 * 当前对应的域名
	 */
	b.domain = "http://m.cyw.com"

	/*******end********/
	window.$base = b;

})(window);
