import { withPluginApi } from 'discourse/lib/plugin-api';
import discourseComputed from "discourse-common/utils/decorators";
import { fieldInputTypes } from '../lib/category-custom-field';


// THIS IS FOR THE CATEGORY DISPLAY (READ-ONLY) SCREEN

export default {
  name: "category-custom-field-intializer",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    const fieldName = siteSettings.category_custom_field_name;
    const fieldType = siteSettings.category_custom_field_type;

    withPluginApi('0.11.2', api => {

      /*
       * type:        step
       * number:      5
       * title:       Add your field to the category settings
       * description: To allow a site admin to configure your field, you need
       *              to add it to the category settings interface
       * references:  app/assets/javascripts/discourse/app/templates/composer.hbs,
       *              app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */

      /*
       * type:        step
       * number:      5.1
       * title:       Setup the category connector class
       * description: Set the actions and properties you'll need in the
       *              composer connector template.
       * references:  app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */
 
      
      api.registerConnectorClass('category-heading', 'category-custom-field-onscreen', {
        setupComponent(attrs, component) {
          const category = attrs.category;

          // The category model does not include a custom_fields object by 
          // default, so we need to make sure it exists before proceeding as
          // that is what we'll be using to ensure our attribute is serialized
          // to the server and updated (see also onChangeField below).
          if (!category.custom_fields) {
            category.custom_fields = {};
          }

          let props = {
            fieldValue: category[fieldName],
            fieldName,
            fieldHeading: I18n.t('category_custom_field.heading', { field: fieldName })
          };
          component.setProperties(Object.assign(props, fieldInputTypes(fieldType)));
        },

        actions: {
          onChangeField(fieldValue) {
            // We set it in the custom_fields object as that is always
            // serialized to the server and updated on the Category model if
            // it is present.
            this.set(`category.custom_fields.${fieldName}`, fieldValue);
          }
        }
      });
      

    });
  }
}