const keyMirror = require('keymirror'),
    Config = require('../config');

module.exports = {
  ActionTypes: keyMirror({
    REQUEST_TEXT: null,
    REQUEST_SENT: null,
    REQUEST_SUCCESS: null,
    TOGGLE_SIDE_NAV: null,
    CLOSE_SIDE_NAV: null,
    SHOW_LOADING_OVERLAY: null,
    HIDE_LOADING_OVERLAY: null,
    RECEIVE_CRUD: null,
    REQUEST_FAILED: null,
    RECEIVE_RAW_JSON: null,
    RECEIVE_CHART_DATA: null,
    RECEIVE_USER_SESSION_DATA: null,
    SET_IMPORTER_DEFINITION: null,
    RECEIVE_USER_DEPLOYMENTS: null
  }),
  Locations: {
    LOGGED_IN_DEFAULT: Config.ROUTE_PREFIX + 'reporting/tagUsage',
    LOGGED_OUT_DEFAULT: Config.ROUTE_PREFIX + 'login'
  },
  CommonGriddle: {
    tableClassName: 'table table-striped table-bordered table-condensed table-hover',
    useGriddleStyles: false,
    settingsToggleClassName: 'btn btn-default',
    resultsPerPage: 25
  },
  RequiredPermissions: [
    's1_mgmt_console.view_resource_importers',
    's1_mgmt_console.view_resource_index',
    's1_mgmt_console.view_import_statistics',
    's1_mgmt_console.create_importer_definition',
    's1_mgmt_console.view_operational_reports',
    's1_mgmt_console.view_tag_usage',
    's1_mgmt_console.view_tag_usage_medium',
    's1_mgmt_console.view_resource_usage',
    's1_mgmt_console.view_interactions',
    's1_mgmt_console.view_contact_events',
    's1_mgmt_console.view_resource_ratings',
    's1_mgmt_console.view_propensity_to_use',
    's1_mgmt_console.view_landing_page_accuracy',
    's1_mgmt_console.view_fulfillment_aggregation',
    's1_mgmt_console.view_supply_chain',
    's1_mgmt_console.view_interaction_effectiveness',
    's1_mgmt_console.view_resource_effectiveness_report',
    's1_mgmt_console.view_fulfillment_data_sources',
    's1_mgmt_console.view_context_service_data_sources',
    's1_resource_manager.view_resourceimporterdefinition',
    's1_resource_manager.add_resourceimporterdefinition',
    's1_resource_manager.change_resourceimporterdefinition',
    's1_resource_manager.execute_import',
    's1_mgmt_console.view_context_profiles',
    's1_mgmt_console.view_context_profile_resources',
    's1_mgmt_console.add_context_profile_resources',
    's1_mgmt_console.delete_context_profile_resources'
  ],
  Statuses: {
    'resourceImporterJobs': {
      'ns': 'Not Started',
      'r': 'Running',
      'f': 'Finished',
      'fa': 'Failed'
    },
    'resourceActivities': {
      'd': 'Deleted',
      'f': 'Failed',
      'c': 'Created',
      'nc': 'No Change',
      'u': 'Updated'
    },
    'resourceUpdates': {
      's': 'Succeeded',
      'sf': 'Succeeded w/ Failures',
      'f': 'Failed',
      'nf': 'Missing',
      'a': 'Archived',
      'nfp': 'Archive Protected'
    },
    'dataJobs': {
      'C': 'Completed with No Errors',
      'CE': 'Completed with Errors',
      'F': 'Failed',
      'S': 'Started'
    }
  },
  //dont change placement of days, affects cron picker
  DaysInAWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  MonthsAbbr: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  lists: {
    'bools': [{
      displayName: 'True',
      parameter: 'True'
    }, {
      displayName: 'False',
      parameter: 'False'
    }],
    'environmentType': [{
      displayName: 'qa',
      parameter: 'qa'
    }, {
        displayName: 'prod',
        parameter: 'prod'
    }],
    'resourceTypes': [{
      displayName: 'Article',
      parameter: 'article'
    }, {
      displayName: 'Video',
      parameter: 'video'
    }],
    'fileFormats': [{
      displayName: 'CSV',
      parameter: 'csv'
    }]
  },
  makeList(statuses){
    return Object.keys(statuses).map((key)=>{
      return {
        displayName: statuses[key],
        parameter: key
      };
    });
  }
};
