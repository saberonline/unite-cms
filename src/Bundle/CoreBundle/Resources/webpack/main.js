
import Vue from "vue";
import 'document-register-element';
import vueCustomElement from 'vue-custom-element';

import moment from 'moment';
import feather from 'feather-icons';
import pageUnload from "./js/pageUnload";
import uniteViewFieldsPlugin from "./js/uniteViewFieldsPlugin";

import BaseView from './vue/views/Base/BaseView.vue';
import TableContent from './vue/views/TableContent.vue';
import GridContent from './vue/views/GridContent.vue';
import TreeContent from './vue/views/TreeContent.vue';
import DomainEditor from "./vue/components/DomainEditor.vue";
import ApiTokenField from "./vue/components/ApiTokenField";
import iFramePreview from "./vue/components/iFramePreview.vue";
import VariantsSelect from "./vue/components/VariantsSelect.vue";
import VariantsVariant from "./vue/components/VariantsVariant.vue";
import Reference from "./vue/field/Reference.vue";
import Link from "./vue/field/Link.vue";
import State from "./vue/field/State.vue";
import AutoText from "./vue/field/AutoText.vue";

import AceDiff from 'ace-diff';
import 'ace-diff/dist/ace-diff.min.css';

require("./sass/unite.scss");

// Use VueCustomElement
Vue.use(vueCustomElement);

// Create unite cms event bus.
window.UniteCMSEventBus = new Vue();

// Register core fields.
Vue.use(uniteViewFieldsPlugin, {
    register: {
        'id': require('./vue/views/Fields/Id').default,
        'text': require('./vue/views/Fields/Text').default,
        'textarea': require('./vue/views/Fields/Textarea').default,
        'auto_text': require('./vue/views/Fields/AutoText').default,
        'date': require('./vue/views/Fields/Date').default,
        'state': require('./vue/views/Fields/State').default,
        'checkbox': require('./vue/views/Fields/Checkbox').default,
        'choice': require('./vue/views/Fields/Choice').default,
        'sortindex': require('./vue/views/Fields/Sortindex').default,
        'selectrow': require('./vue/views/Fields/Selectrow').default,
        'reference': require('./vue/views/Fields/Reference').default,
        'tree_view_children': require('./vue/views/Fields/TreeViewChildren').default,
    }
});

// Register global unite cms core components.
Vue.customElement('unite-cms-core-domaineditor', DomainEditor);
Vue.customElement('unite-cms-core-variants-select', VariantsSelect);
Vue.customElement('unite-cms-core-variants-variant', VariantsVariant);
Vue.customElement('unite-cms-core-api-token-field', ApiTokenField);
Vue.customElement('unite-cms-core-iframe-preview', iFramePreview);
Vue.customElement('unite-cms-core-reference-field', Reference);
Vue.customElement('unite-cms-core-link-field', Link);
Vue.customElement('unite-cms-core-state-field', State);
Vue.customElement('unite-cms-core-auto-text-field', AutoText);

// Register views.
Vue.customElement('unite-cms-core-view-table', {
    extends: BaseView,
    contentComponent: TableContent
});

Vue.customElement('unite-cms-core-view-grid', {
    extends: BaseView,
    contentComponent: GridContent
});

Vue.customElement('unite-cms-core-view-tree', {
    extends: BaseView,
    contentComponent: TreeContent
});

// Create vue moment filter.
moment.locale(window.navigator.language);

Vue.filter('dateFromNow', function(value) {
    let date = (typeof value === 'string') ? moment(value) : moment.unix(value);
    return value ? date.fromNow() : '';
});

Vue.filter('date', function(value) {
    let date = (typeof value === 'string') ? moment(value) : moment.unix(value);
    return value ? date.format('LL') : '';
});

Vue.filter('dateFull', function(value) {
    let date = (typeof value === 'string') ? moment(value) : moment.unix(value);
    return value ? date.format('LLL') : '';
});


window.onload = function() {

    // Replace all feather icons in html code.
    feather.replace();

    // Add a generic unload warning message to all pages with forms.
    pageUnload.init('You have unsaved changes! Do you really want to navigate away and discard them?');

    let diffVisualization = document.querySelector('.unite-domain-change-visualization');
    if(diffVisualization) {

        let formatJSON = function(value) {
            value = JSON.stringify(JSON.parse(value), null, 2);
            value = value.replace(/^( *)(.*\[)(\],*)$/gm, "$1$2\n$1$3");
            value = value.replace(/^( *)(.*\{)(\},*)$/gm, "$1$2\n$1$3");
            return value;
        };

        let JSONDiff = new AceDiff({
            element: diffVisualization,
            mode: 'ace/mode/json',
            left: {
                content: formatJSON(diffVisualization.dataset.leftContent),
                editable: false,
                copyLinkEnabled: false
            },
            right: {
                content: formatJSON(diffVisualization.dataset.rightContent),
                editable: false,
                copyLinkEnabled: false
            },
        });

        JSONDiff.editors.left.ace.setFontSize(10);
        JSONDiff.editors.right.ace.setFontSize(10);
    }
};