function App() {
	this.apiUrl = 'https://app.asana.com/api/1.0/';
	this.workspaceId = 167784858458;
}

App.prototype.get = function(url) {
	return $.ajax({
		url: this.apiUrl + url,
		headers: {
			'Authorization': 'Bearer 0/ca452edc7b437b5f4ccc334a07911cac'
		}
	});
};

App.prototype.getProjects = function(workspaceId) {
	if (workspaceId == undefined) {
		return false;
	}

	return this.get('workspaces/' + workspaceId + '/projects?archived=false');
};

App.prototype.getTasks = function(projectId) {
	if (projectId == undefined) {
		return false;
	}

	return this.get('projects/' + projectId + '/tasks');
};

App.prototype.getTask = function(taskId) {
	if (taskId == undefined) {
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
		// data, statusText, jqXHR
	});
};

App.prototype.drawProjects = function(projects) {

}

App.prototype.drawTasks = function(tasks) {

}

App.prototype.drawTask = function(task) {

}

$app = new App();

$(function() {
	$app.getData($app.workspaceId);
});
