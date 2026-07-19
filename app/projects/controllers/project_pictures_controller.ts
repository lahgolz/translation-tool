import type { HttpContext } from '@adonisjs/core/http';

import Project from '../models/project.ts';
import projectService from '../services/project_service.ts';
import { uploadProjectPictureValidator } from '../validators/project_picture.ts';

export default class ProjectPicturesController {
	async store({ params, request, response, session }: HttpContext) {
		const project = await Project.findByOrFail('slug', params.slug);
		const { picture } = await request.validateUsing(uploadProjectPictureValidator);

		await projectService.updatePicture(project, picture);

		session.flash('success', 'Project picture updated');

		return response.redirect().back();
	}

	async destroy({ params, response, session }: HttpContext) {
		const project = await Project.findByOrFail('slug', params.slug);

		await projectService.removePicture(project);

		session.flash('success', 'Project picture removed');

		return response.redirect().back();
	}
}
