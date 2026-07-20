import type { HttpContext } from '@adonisjs/core/http';

import Project from '../models/project.ts';
import projectService from '../services/project_service.ts';
import { addProjectLanguageValidator } from '../validators/project_language.ts';

export default class ProjectLanguagesController {
	async store({ params, request, response, session }: HttpContext) {
		const project = await Project.findByOrFail('slug', params.slug);
		const { language } = await request.validateUsing(addProjectLanguageValidator);

		const added = await projectService.addLanguage(project, language);

		if (added) {
			session.flash('success', 'Language added');
		} else {
			session.flash('error', 'That language has already been added');
		}

		return response.redirect().back();
	}

	async destroy({ params, response, session }: HttpContext) {
		const project = await Project.findByOrFail('slug', params.slug);

		const removed = await projectService.removeLanguage(project, params.language);

		if (removed) {
			session.flash('success', 'Language removed');
		} else {
			session.flash('error', 'The default language cannot be removed');
		}

		return response.redirect().back();
	}

	async setDefault({ params, response, session }: HttpContext) {
		const project = await Project.findByOrFail('slug', params.slug);

		const updated = await projectService.setDefaultLanguage(project, params.language);

		if (updated) {
			session.flash('success', 'Default language updated');
		} else {
			session.flash('error', 'That language is not part of this project');
		}

		return response.redirect().back();
	}
}
