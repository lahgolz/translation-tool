import type { HttpContext } from '@adonisjs/core/http';

import Project from '../models/project.ts';
import projectService from '../services/project_service.ts';
import ProjectTransformer from '../transformers/project_transformer.ts';
import { createProjectValidator, updateProjectValidator } from '../validators/projects.ts';

export default class ProjectsController {
	async index({ inertia }: HttpContext) {
		const projects = await Project.query().preload('languages').orderBy('name', 'asc');

		return inertia.render('projects/index', {
			projects: ProjectTransformer.transform(projects),
		});
	}

	async create({ inertia }: HttpContext) {
		return inertia.modal('projects/create', {}, { route: 'projects.index' });
	}

	async store({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createProjectValidator);
		const project = await projectService.createProject(data);

		session.flash('success', 'Project created');

		return response.redirect().toRoute('projects.show', { slug: project.slug });
	}

	async show({ params, request, breadcrumbs, inertia }: HttpContext) {
		const project = await Project.query().where('slug', params.slug).preload('languages').firstOrFail();

		breadcrumbs.add(project.name, request.url());

		return inertia.render('projects/show', {
			project: ProjectTransformer.transform(project),
			breadcrumbs: breadcrumbs.get(),
		});
	}

	async update({ params, request, response, session }: HttpContext) {
		const project = await Project.findByOrFail('slug', params.slug);
		const data = await request.validateUsing(updateProjectValidator);

		await projectService.updateSettings(project, data);

		session.flash('success', 'Project settings updated');

		return response.redirect().toRoute('projects.show', { slug: project.slug });
	}

	async settings({ params, breadcrumbs, inertia }: HttpContext) {
		const project = await Project.query().where('slug', params.slug).preload('languages').firstOrFail();

		breadcrumbs.add(project.name, `/projects/${project.slug}`);
		breadcrumbs.add('Settings', `/projects/${project.slug}/settings`);

		return inertia.render('projects/settings', {
			project: ProjectTransformer.transform(project),
			breadcrumbs: breadcrumbs.get(),
		});
	}
}
