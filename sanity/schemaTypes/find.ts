
import {defineField, defineType} from 'sanity'

export const findType = defineType({
  name: 'find',
  title: 'Find',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'type',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Freebie', value: 'freebie'},
          {title: 'Deal', value: 'deal'},
          {title: 'Event', value: 'event'},
          {title: 'Food & Drinks', value: 'food'},
          {title: 'Things To Do', value: 'things-to-do'},
          {title: 'Pop-Up', value: 'pop-up'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description:
        'Used to organize Finds into collections and filters.',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Free', value: 'free'},
          {title: 'Pop-up', value: 'pop-up'},
          {title: 'Grand Opening', value: 'grand-opening'},
          {title: 'Giveaway', value: 'giveaway'},
          {title: 'Food & Drinks', value: 'food-drinks'},
          {title: 'Shopping', value: 'shopping'},
          {title: 'Holiday', value: 'holiday'},
          {title: 'Family Friendly', value: 'family-friendly'},
          {title: 'Date Night', value: 'date-night'},
          {title: 'Student Discount', value: 'student-discount'},
          {title: 'BOGO', value: 'bogo'},
          {title: 'Limited Time', value: 'limited-time'},
          {title: 'Festival', value: 'festival'},
          {title: 'Market', value: 'market'},
          {title: 'Art & Culture', value: 'art-culture'},
        ],
      },
    }),

    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{type: 'brand'}],
    }),

    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      description:
        'Short description for cards, search results and previews.',
      validation: (rule) => rule.max(200),
    }),

    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      description:
        'Add every venue where this Find is available.',
      of: [
        {
          type: 'reference',
          to: [{type: 'venue'}],
        },
      ],
    }),

    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
    }),

    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      description: 'Optional. When this time passes, the Find automatically disappears from active website listings. Leave blank for ongoing deals. The published detail page stays available.',
      validation: (rule) => rule.custom((value, context) => {
        const start = context.document?.startDate
        if (value && typeof start === 'string' && new Date(value).getTime() < new Date(start).getTime()) return 'End Date must be after Start Date.'
        return true
      }),
    }),

    defineField({
      name: 'isFree',
      title: 'Is this free?',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description:
        'Examples: $5, From $20, 50% off',
      hidden: ({document}) => document?.isFree === true,
    }),

    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description:
            'Describe the actual image for accessibility and SEO.',
        }),
      ],
    }),

    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}],
      description:
        'Detailed information about the Find.',
    }),

    defineField({
      name: 'howToClaim',
      title: 'How to Claim / Attend',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'restrictions',
      title: 'Restrictions & Conditions',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'sourceUrl',
      title: 'Official Source URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}),
    }),

defineField({
  name: 'admissionType',
  title: 'Admission Type',
  type: 'string',
  options: {
    list: [
      {title: 'Free', value: 'free'},
      {title: 'Paid', value: 'paid'},
      {title: 'Free With Purchase', value: 'free-with-purchase'},
    ],
  },
}),

defineField({
  name: 'bookingType',
  title: 'Booking Type',
  type: 'string',
  options: {
    list: [
      {title: 'Walk-in', value: 'walk-in'},
      {title: 'RSVP Required', value: 'rsvp'},
      {title: 'Tickets Required', value: 'tickets'},
    ],
  },
}),

defineField({
  name: 'featured',
  title: 'Featured on Homepage',
  type: 'boolean',
  initialValue: false,
}),

  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'image',
    },
  },
})
