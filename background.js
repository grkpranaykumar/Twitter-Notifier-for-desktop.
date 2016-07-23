var ids=[];
var messages=[];
var latestId;
$(function () {
	engine();
	setInterval(engine,20000);
});

function engine()
{
	var newTweets=[];
	$.get('https://twitter.com/i/notifications',function(data){
		var htmlData=data;
		$data=$(htmlData).find("#stream-items-id").eq(0);
		$data.find('.activity-supplement').remove();	//remove unnecessary data from required
		$data.find('.activity-truncated-tweet').remove();
		//$('body').append($data); 
		for(i=0;i<$data.find('li.stream-item').length;i++)//looping through notifications
		{
			ids[i]=$data.find('li.stream-item').eq(i).attr('data-item-id');//grabbing id
			messages[i]=($($data).find('li.stream-item').eq(i).find('div.stream-item-activity-line').text()).replace(/\n/g,'').trim();
			//grabbing message
		}
		/*latestId=ids[0];
		console.log(ids);
		console.log(messages);*/
		if(latestId==ids[0]){
			//no update
		}
		else if (latestId===undefined){
			var firstRun={
			type:"basic",
			title:"Twitter Notifier",
			message:"Check your twitter account for latest notifications",
			contextMessage:"Twitter Notifier",
			buttons:[{
				title:"Open Link"
			}],
			iconUrl:"icon.png"
			};//details that chrome require from you
			chrome.notifications.onButtonClicked.addListener(function(){
					window.open('https://twitter.com/i/notifications');
				});

			chrome.notifications.create(firstRun);
			latestId=ids[0];
		}
		else if(latestId!=ids[0]){//there is some new activity in user account
			for(j=0;j<ids.length;j++){//finding all notifications in 20 secs.
				if(latestId==ids[j]){
					break;
				}
				else{
					if(messages[j]!=""){
						newTweets[j]=messages[j];
					}
				}
			}
			latestId=ids[0];
		}

		if(newTweets.length==0){
			//nothing
		}
		else{
			for(i=0;i<newTweets.length;i++){
				var myTweet={
				type:"basic",
				title:"You got new notification in twitter",
				message:newTweets[i],
				contextMessage:"Twitter Notifier",
				buttons:[{
					title:"Open Link"
				}],
				iconUrl:"icon.png"
				};

				chrome.notifications.onButtonClicked.addListener(function(){
					window.open('https://twitter.com/i/notifications');
				});
				chrome.notifications.create(myTweet);
			}
		}
		//	console.log(latestId);
		//	console.log(newTweets);
	});
//alert();
}