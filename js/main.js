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

		$('.projects a').removeClass('active');
		$(this).addClass('active');

		$('.tasks').html('<span class="text-muted">loading...</span>');
		$('.task').html('');
	});

	$('.tasks').on('click', 'a', function(e) {
		e.preventDefault();

		self.getData(false, false, $(this).attr('data-id'));

		$('.tasks a').removeClass('active');
		$(this).addClass('active');

		$('.task').html('<span class="text-muted">loading...</span>');
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

	return this.get('projects/' + projectId + '/tasks?opt_fields=name,completed,assignee.photo');
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
						var taskName = taskList[task]['name'],
							className = '',
							photo = '';

						if (taskList[task]['completed']) {
							className += ' completed';
						}

						if (taskList[task]['assignee'] != null) {
							photo = '<span class="assignee-photo" style="background-image: url(' +
								taskList[task]['assignee']['photo']['image_21x21'] +
								')"></span>';
						}

						if (taskName.substr(taskName.length - 1) == ':') {
							className += ' separator';
						}

						html +=
							'<a href="#" class="list-group-item' + className + '" data-id="' + taskList[task]['id'] + '">' +
								photo +
								'<span class="name">' + taskName + '</span>' +
							'</a>';
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
			var html = '<div class="well">',
				taskDeatils = task[0]['data'];

			html += '<div class="lead">' + taskDeatils['name'] + '</div>';
			html += '<p>' + this.nl2br(taskDeatils['notes']) + '</p>';

			html += '</div>';

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
