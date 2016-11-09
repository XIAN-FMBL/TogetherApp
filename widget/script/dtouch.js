(function(window) {
	var touch = null

	var t = {}

	t.setListener = function() {
		if (touch == null) {
			touch = api.require('3DTouch');
		}
		touch.setListener(function(ret, err) {
			var type = ret.type;
			alert(type)
		})
	}

	t.setItems = function() {
		if (touch == null) {
			touch = api.require('3DTouch');
		}
		touch.setShortcutItems({
			items : [{
				type : 'com.api.testapp.favorite',
				title : 'Favorites测试1',
				icon : {
					type : 0
				},
				userInfo : {
					'key1' : 'value1'
				}
			}, {
				type : 'com.api.testapp.compose',
				title : 'New Message测试2',
				icon : {
					type : 0
				},
				userInfo : {
					'key2' : 'value2'
				}
			}]
		});
	}

	window.touch = t

})(window)

