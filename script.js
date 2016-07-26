var elem = document.getElementsByClassName('cluster');
var colors = ["gray", "red", "green", "blue", "magenta"];
var used_colors = [];
var points = [];
var cluster_points = [];

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function redrawPoints(points, class_name) {
  $("." + class_name).remove();
  for(var i in points){
    var div = $('<div class="' + class_name + '">').css({
      "left": points[i].x + 'px',
      "top": points[i].y + 'px',
      "background-color": points[i].color
    });
    $(".workspace").append(div);
  }
};

function moveCluster(old,newly) {
  for(i in old) {
    $(elem[i]).stop().animate({ "left": newly[i].x + 'px', "top": newly[i].y + 'px' }, "slow");
  }
};

function euclideanDistance(p1, p2){
	return Math.sqrt(Math.pow((p1.x-p2.x),2) + Math.pow((p1.y-p2.y),2));
};

function manhattanDistance(p1, p2){
	return Math.abs(p1.x-p2.x) + Math.abs(p1.y-p2.y);
};

function massCenter(points, color){
	var result = {x:0, y:0};
	var n = 0;
	for(i in points){
		if(points[i].color == color){
			n += 1;
			result.x += points[i].x;
			result.y += points[i].y;
		}
	}
	result.x = Math.round(result.x / n);
	result.y = Math.round(result.y / n);
	return result;
}

function medianCenter(points, color){
var result = {x:0, y:0};
	var n = 0;
	var color_points = [];
  for(i in points){
		if(points[i].color == color){
			n += 1;
      color_points.push(points[i]);
		}
	}
	var rest = ((n % 2) + 1) % 2; // 0 or 1
	n = Math.round(n / 2);
	result.x = Math.round(color_points.sort(function(a,b){return a.x-b.x;})[n-1].x);
	result.x += rest*Math.round((color_points[n].x-color_points[n-1].x) / 2);
	result.y = Math.round(color_points.sort(function(a,b){return a.y-b.y;})[n-1].y);
	result.y += rest*Math.round((color_points[n].y-color_points[n-1].y) / 2);
	return result;
}

function newClasterCords(cluster_points,points,centerMod){
  var result = $.extend( true, [], cluster_points );
	for(var i in result){
		new_cords = centerMod(points, result[i].color);
		result[i].x = new_cords.x;
		result[i].y = new_cords.y;
	}
	return result;
}

function kMiddle(points, clusters, metric){
	var e_disance_array = [];
	for(var i in clusters){
		e_disance_array[i] = [];
		for(var j in points){
			e_disance_array[i].push(metric(clusters[i], points[j]));
		}
	}
	var new_points = points;
	for(var i in points){
		var min_dist = 9999999;
		for(var j in clusters){
			if(e_disance_array[j][i] < min_dist){
				min_dist = e_disance_array[j][i];
        new_points[i].color = clusters[j].color;
			}
		}
	}
	return new_points;
};

function eMid() {
    points = kMiddle(points, cluster_points, euclideanDistance);
    redrawPoints(points, 'point');
    new_cluster_points = newClasterCords(cluster_points, points, massCenter);
    moveCluster(cluster_points, new_cluster_points);
    cluster_points = new_cluster_points;
};

function eMed() {
    points = kMiddle(points, cluster_points, euclideanDistance);
    redrawPoints(points, 'point');
    new_cluster_points = newClasterCords(cluster_points, points, medianCenter);
    moveCluster(cluster_points, new_cluster_points);
    cluster_points = new_cluster_points;
};

function mMid() {    
    points = kMiddle(points, cluster_points, manhattanDistance);
    redrawPoints(points, 'point');
    new_cluster_points = newClasterCords(cluster_points, points, massCenter);
    moveCluster(cluster_points, new_cluster_points);
    cluster_points = new_cluster_points;
};

function mMed() {
    points = kMiddle(points, cluster_points, manhattanDistance);
    redrawPoints(points, 'point');
    new_cluster_points = newClasterCords(cluster_points, points, medianCenter);
    moveCluster(cluster_points, new_cluster_points);
    cluster_points = new_cluster_points;
};

$('#p3').change(function(e) {
  var color = colors[this.value];
  $('#color-tag').text(color.capitalize());
});

$('#run').click(function(e) {
  switch($('#select').val()) {
    case 'e_mid':
      eMid();
      break;
    case 'e_med':
      eMed();
      break;
    case 'm_mid':
      mMid();
      break;
    case 'm_med':
      mMed();
      break;
    default:
      alert("No Method Found");
  }
});

$('#clr').click(function(e) {
  $('.workspace').empty();
  used_colors = [];
  points = [];
  cluster_points = [];  
});

$(".workspace").click(function(e) {
  var offset = $('#p1').is(":checked") ? (3 + 5) : (3 + 15);
  var x = e.pageX - $(this).offset().left - offset;
  var y = e.pageY - $(this).offset().top - offset;
  var p = $('#p1').is(":checked") ? "point" : "cluster";
  var color = "black"
  if (p == "cluster") {
    color = colors[$('#p3').val()];
    if (used_colors.indexOf(color) == -1) {
      used_colors.push(color);
    } else {
      alert('This color is already in use.');
      return;
    }
    cluster_points.push({
      x: x,
      y: y,
      color: color
    })
  } else {
    points.push({
      x: x,
      y: y
    });
  };

  var div = $('<div class="' + p + '">').css({
    "left": x + 'px',
    "top": y + 'px',
    "background-color": color
  });
  
  $(this).append(div);
});