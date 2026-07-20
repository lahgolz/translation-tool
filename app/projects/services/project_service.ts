import type { MultipartFile } from '@adonisjs/core/bodyparser';
import string from '@adonisjs/core/helpers/string';
import drive from '@adonisjs/drive/services/main';
import db from '@adonisjs/lucid/services/db';

import Project from '../models/project.ts';

export class ProjectService {
	async createProject(data: { name: string; languages: string[]; defaultLanguage: string; picture?: MultipartFile }) {
		const slug = await this.generateUniqueSlug(data.name);
		const picture = data.picture ? await this.storePicture(data.picture) : null;

		return db.transaction(async (transaction) => {
			const project = await Project.create(
				{
					name: data.name,
					slug: slug,
					defaultLanguage: data.defaultLanguage,
					picture: picture,
				},
				{ client: transaction },
			);

			await project.related('languages').createMany(data.languages.map((languageCode) => ({ languageCode })));

			return project;
		});
	}

	async addLanguage(project: Project, languageCode: string) {
		const exists = await project.related('languages').query().where('languageCode', languageCode).first();

		if (exists) {
			return false;
		}

		await project.related('languages').create({ languageCode });

		return true;
	}

	async removeLanguage(project: Project, languageCode: string) {
		if (languageCode === project.defaultLanguage) {
			return false;
		}

		await project.related('languages').query().where('languageCode', languageCode).delete();

		return true;
	}

	async setDefaultLanguage(project: Project, languageCode: string) {
		const exists = await project.related('languages').query().where('languageCode', languageCode).first();

		if (!exists) {
			return false;
		}

		project.defaultLanguage = languageCode;

		await project.save();

		return true;
	}

	async updateSettings(project: Project, data: { name: string }) {
		if (project.name.toLocaleLowerCase() !== data.name.toLocaleLowerCase()) {
			project.slug = await this.generateUniqueSlug(data.name);
		}

		project.name = data.name;

		await project.save();

		return project;
	}

	async updatePicture(project: Project, file: MultipartFile) {
		if (project.picture) {
			await drive.use().delete(project.picture);
		}

		project.picture = await this.storePicture(file);

		await project.save();

		return project;
	}

	async removePicture(project: Project) {
		if (project.picture) {
			await drive.use().delete(project.picture);

			project.picture = null;

			await project.save();
		}

		return project;
	}

	private async storePicture(file: MultipartFile) {
		const key = `projects/${string.generateRandom(24)}.${file.extname}`;

		await file.moveToDisk(key);

		return key;
	}

	private async generateUniqueSlug(name: string) {
		const base = string.slug(name).toLowerCase();
		let slug = base;
		let suffix = 2;

		while (await Project.findBy('slug', slug)) {
			slug = `${base}-${suffix}`;
			suffix += 1;
		}

		return slug;
	}
}

export default new ProjectService();
