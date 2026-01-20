export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Emoji icon for the category (e.g., 💰, 🏢, 🏗️)',
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Purple', value: 'purple' },
          { title: 'Orange', value: 'orange' },
          { title: 'Red', value: 'red' },
          { title: 'Pink', value: 'pink' },
          { title: 'Indigo', value: 'indigo' },
        ],
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
}
