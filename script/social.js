/**
 *
 *	jQuery Plugin - Social
 *
 *
 *
 */

 (function() {

 	$.fn.social = function (options) {

 		var URL = {
 			'facebook' : {
	 			base: 'https://graph.facebook.com/',
	 			after: 'feed',
	 			api_token: 'access_token',
	 			icon: 'f',
	 			color: '#069'
	 		}
 		}
 		
 		var settings = $.extend({

 			// Social Networking websites
 			site: 'facebook',

 			// URL of the page
 			URL: 'fitmount',

 			// Total Number of posts to show
 			count: 10,

 			// Make it circular
 			circular: true,

 			// API key provided by Facebook - sample token
 			API: 'CAACEdEose0cBAJa8qCvGIZBXGsk7ySYBPLFy3JrRQJQC40ku6W3ZCpBmbAZCrw5mh8v9LPbqZA3TpZCxan27RB3JkMUBkZAVTKFN1IvMe1bQ9Hia5pq0pX3qYv6KYf0BRy7yYMpKPZBzuQb8qq3SKM83deIam5gbyqfqitaA7dZCgurmoJq0XAn3g6zoRuG7efTnpTxcX5r846gR7y0RZBO3Q',

 			//

 		}, options);

 		var iteration = 0;

 		String.prototype.trimToLength = function(m) {
		  return (this.length > m) 
		    ? jQuery.trim(this).substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
		    : this;
		};


 		var retrieveData = function() {

 			if(!URL[settings.site]) {
 				console.log('Site is not available!');
 				return;
 			}

 			var data = {};
 			data[URL[settings.site].api_token] = settings.API;

	 		var ajax = $.ajax({

	 			url: URL[settings.site].base + settings.URL + '/' + URL[settings.site].after,
	 			type: 'GET',
	 			dataType: 'json',
	 			data: data,

	 			success: function(response) {
	 				//console.log("success", response);
	 				buildIcon();
	 				buildModel(response.data);
	 			},
	 			failed: function() {
	 				console.log('failed');
	 			}
	 		});
	 	}

	 	var buildIcon = function() {
	 		if($('#social_' + settings.site + '_icon').length) return;
	 		var span = $('<span/>', {
	 			class: 'social_icon',
	 			id: 'social_' + settings.site + '_icon'
	 		});

	 		span.css({
	 			'background-color': URL[settings.site].color
	 		});

	 		$('body').append(span);

	 		span.click(function() {
	 			if($('#' + settings.site + '-model').css('display') == 'block')
	 				hideModel();
	 			else
	 				showModel();
	 		});
	 	}

	 	var showModel = function() {
	 		if($('#' + settings.site + '-model').length) {
	 			$('#' + settings.site + '-model').css('display', 'block');
	 			setTimeout(function() {
	 				$('#' + settings.site + '-model').css('opacity', '1');
	 			}, 200);
	 		}
	 	}

	 	var hideModel = function() {
	 		if($('#' + settings.site + '-model').length) {
	 			$('#' + settings.site + '-model').css('opacity', '0');
	 			setTimeout(function() {
	 				$('#' + settings.site + '-model').css('display', 'none');
	 			}, 200);
	 		}
	 	}

	 	var nextPost = function(data, div) {
	 		iteration++;
	 		if(iteration >= settings.count) {
	 			if(settings.circular)
	 				iteration = 0;
	 		}

	 		if(iteration < settings.count) {
	 			showPost(iteration, data, div);
	 		}
	 	}

	 	var previousPost = function(data, div) {
	 		iteration--;
	 		if(iteration < 0) {
	 			if(settings.circular)
	 				iteration = settings.count-1;
	 		}

	 		if(iteration >= 0) {
	 			showPost(iteration, data, div);
	 		}
	 	}

	 	var showPost = function(index, data, div) {
	 		var value = data[index];
	 		switch(value.type) {
	 			case 'photo': div.html(buildImagePost(value.story, value.link, value.picture, value.created_time));
	 							break;
	 			case 'link':  div.html(buildLinkPost(value.message, value.picture, value.name, value.link, value.created_time));
	 							break;
	 			case 'text':  div.html(buildTextPost(value.message, value.created_time));
	 							break;
	 		}
	 	}

	 	var buildModel = function(data) {
	 		if(!$('#' + settings.site + '-model').length) {
	 			var div = $('<div />', {
	 				id: settings.site + '-model',
	 				class: 'social_model'
	 			});


	 			$('body').append(div);

	 			var post = $("<div />", {id: 'social_post_holder'}).appendTo(div);
	 			var triangle = $("<span />", {class: 'arrow-down'}).appendTo(div);

	 			// add posts
	 			iteration = 0;
	 			showPost(iteration, data, post);

	 			var control_next = $("<i/>",{
	 				id: 'social_post_next'
	 			}).appendTo(div);
	 			var control_prev = $("<i/>", {
	 				id:'social_post_prev'
	 			}).appendTo(div);

	 			control_next.click(function() {
	 				nextPost(data, post);
	 			});
	 			control_prev.click(function() {
	 				previousPost(data, post);
	 			});
	 		}
	 	}

	 	var buildImagePost = function(message, link, image, time) {
	 		//console.log('Image', message, image, time);
	 		var div = $("<div />");

	 		var span = $("<span />", {
	 			text: time.substr(0, time.search('T'))
	 		}).appendTo(div);

	 		if(message) {

		 		var p = $("<h4 />", {
		 			text: message.trimToLength(150)
		 		}).appendTo(div);
		 	}

	 		var img = $("<img />", {
	 			src: image
	 		}).appendTo(div);

	 		div.click(function () {
	 			window.open(link);
	 		});

	 		return div;
	 	}

	 	var buildLinkPost = function(message, image, link_title, link_url, time) {
	 		//console.log('Link', message, image, link_title, link_url, time);
	 		var div = $("<div />");

	 		var span = $("<span />", {
	 			text: time.substr(0, time.search('T'))
	 		}).appendTo(div);

	 		var img = $("<img />", {
	 			src: image
	 		}).appendTo(div);

	 		var h4 = $("<h4 />", {
	 			text: link_title
	 		}).appendTo(div);

	 		var p = $("<p />", {
	 			text: message.trimToLength(150)
	 		}).appendTo(div);

	 		div.click(function () {
	 			window.open(link_url);
	 		});

	 		return div;
	 	}

	 	var buildTextPost = function(message, time) {
	 		//console.log('Text', message, time);
	 		var div = $("<div />");

	 		var span = $("<span />", {
	 			text: time.substr(0, time.search('T'))
	 		}).appendTo(div);

	 		var p = $("<p />", {
	 			text: message.trimToLength(300)
	 		}).appendTo(div);

	 		return div;
	 	}


	 	return retrieveData();

 	}

 })(jQuery);