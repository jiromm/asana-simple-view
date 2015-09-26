function App() {
	this.apiUrl = 'https://app.asana.com/api/1.0/';
	this.workspaceId = 167784858458;
	this.nl2br = function(string) {
		return string.replace(/([^>])\n/g, '$1<br/>');
	}
}

App.prototype.init = function() {
	var self = this;

	// Get project
	this.getData(this.workspaceId, false, false);

	$('.projects').on('click', 'a', function(e) {
		e.preventDefault();

		self.getData(false, $(this).attr('data-id'), false);
	});

	$('.tasks').on('click', 'a', function(e) {
		e.preventDefault();

		self.getData(false, false, $(this).attr('data-id'));
	});
};

App.prototype.get = function(url) {
	return $.ajax({
		url: this.apiUrl + url,
		headers: {
			'Authorization': 'Bearer 0/ca452edc7b437b5f4ccc334a07911cac'
		}
	});
};

App.prototype.getProjects = function(workspaceId) {
	if (workspaceId == false) {
		return false;
	}

	return this.get('workspaces/' + workspaceId + '/projects?archived=false');
};

App.prototype.getTasks = function(projectId) {
	if (projectId == false) {
		return false;
	}

	return this.get('projects/' + projectId + '/tasks');
};

App.prototype.getTask = function(taskId) {
	if (taskId == false) {
		return false;
	}

	return this.get('tasks/' + taskId);
};

App.prototype.getData = function(workspaceId, projectId, taskId) {
	var self = this;

	$.when(
		this.getProjects(workspaceId),
		this.getTasks(projectId),
		this.getTask(taskId)
	).done(function(projects, tasks, task) {
		console.log('a', projects, tasks, task);

		self.drawProjects(projects);
		self.drawTasks(tasks);
		self.drawTask(task);
	});
};

App.prototype.drawProjects = function(projects) {
	var selector = '.projects';

	if (projects !== false) {
		if (projects[1] == 'success') {
			var html = '<div class="list-group">',
				projectList = projects[0]['data'];

			if (projectList.length) {
				for (var project in projectList) {
					if (projectList.hasOwnProperty(project)) {
						html += '<a href="#" class="list-group-item" data-id="' + projectList[project]['id'] + '">' + projectList[project]['name'] + '</a>';
					}
				}
			}

			html += '</div>';

			$(selector).html(html);
		} else {
			$(selector).html('Error! Something went wrong.');
		}
	}
}

App.prototype.drawTasks = function(tasks) {
	var selector = '.tasks';

	if (tasks !== false) {
		if (tasks[1] == 'success') {
			var html = '<div class="list-group">',
				taskList = tasks[0]['data'];

			if (taskList.length) {
				for (var task in taskList) {
					if (taskList.hasOwnProperty(task)) {
						html += '<a href="#" class="list-group-item"  data-id="' + taskList[task]['id'] + '">' + taskList[task]['name'] + '</a>';
					}
				}
			}

			html += '</div>';

			$(selector).html(html);
		} else {
			$(selector).html('Error! Something went wrong.');
		}
	}
}

App.prototype.drawTask = function(task) {
	var selector = '.task';

	if (task !== false) {
		if (task[1] == 'success') {
			var html = '',
				taskDeatils = task[0]['data'];

			console.log(taskDeatils);
			console.log(taskDeatils.length);

			html += '<div class="lead">' + taskDeatils['name'] + '</div>';
			html += '<p>' + this.nl2br(taskDeatils['notes']) + '</p>';

			$(selector).html(html);
		} else {
			$(selector).html('Error! Something went wrong.');
		}
	}
}

app = new App();

$(function() {
	app.init();
});
