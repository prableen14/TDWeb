import {defineField, defineType} from 'sanity'
import VenueGeocodeInput from '../components/VenueGeocodeInput'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Venue Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Shared Venue Image',
      type: 'image',
      description: 'Used automatically for Finds without their own image.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe what is actually shown in the image.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({name:'image',title:'Shared Venue Image',type:'image',description:'Used for Finds without their own or brand image.',options:{hotspot:true},fields:[defineField({name:'alt',title:'Alt Text',type:'string',validation:(rule)=>rule.required()})]}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'string',
    }),

    defineField({
      name: 'neighbourhood',
      title: 'Neighbourhood',
      type: 'string',
    }),

    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      initialValue: 'Toronto',
    }),

    defineField({
      name: 'province',
      title: 'Province',
      type: 'string',
      initialValue: 'Ontario',
    }),

    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
    }),

    defineField({
      name: 'location',
      title: 'Map Location',
      type: 'geopoint',
      description: 'Latitude and longitude used for Near Me results.',
      components: {input: VenueGeocodeInput},
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'neighbourhood',
    },
  },
})