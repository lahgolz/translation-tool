import Project from '#projects/models/project';
import factory from '@adonisjs/lucid/factories';

export const ProjectFactory = factory
	.define(Project, ({ faker }) => {
		return {
			name: faker.company.name(),
			slug: faker.lorem.slug(),
			defaultLanguage: 'en',
		};
	})
	.build();
