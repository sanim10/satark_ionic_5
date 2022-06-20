import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  checklogin(token): Observable<any> {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/users_new_get?token=' + token
    );
    // .pipe(
    //   map((response: any) => {
    //     console.log(response);
    //     // alert(response + 'response');
    //   })
    // );
  }

  resetPassword(email: string): any {
    console.log(email);
    return sendPasswordResetEmail(getAuth(), email);
  }

  getOtp(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/otp_get?phone=' + param.phone
    );
  }

  verifyOtp(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/verifyotp_get?otp=' +
        param.otp +
        '&ph=' +
        param.phone
    );
  }

  get_check_app_version() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/check_app_version_get'
    );
  }

  //get flash alert message
  getFlashAlertMsg() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/flash_alert_get'
    );
  }

  getDistrictById(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/district_by_id_get?id=' + param.id
    );
  }

  getAllBlocks() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/all_block_get'
    );
  }

  getDistrict() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/district_get'
    );
  }

  getBlocks(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/block_get?id=' + param.id
    );
  }

  /////get favourite location of user by userid
  getFavLocations(id) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/fav_loc_by_user_get?id=' + id
    );
  }

  //10 day imd data on district level for weather forecast
  get10daysImdDistrictHeatwave() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/weather_imd_dis_data_for_map_get'
    );
  }

  //single day imd data on blocks under a district for weather forecast
  get1daysImdBlockHeatwave(district_id) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_weather/updated_value_addition_all_block_by_district_data_get?id=' +
        district_id
    );
  }

  ///get 10 days IMD data for weather forecast home page
  get10DaysImdDataForWeather(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_weather/imd_for_each_block_data_get?id=' +
        param.block_id
    );
  }

  ///get 10 days IMD value addition data for weather forecast home page
  get10DaysImdValueAdditionDataForWeather(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_weather/imd_rainfall_value_addition_for_block_get?id=' +
        param.block_id
    );
  }
  ///get updated value addition data for weather forecast home page

  getUpdatedValueAdditionDataForWeather(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_weather/updated_value_addition_data_get?id=' +
        param.block_id
    );
  }

  //fetch IMD heatwave Alerts
  getImdHeatwaveAlerts() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/imd_heatwave_alerts_get'
    );
  }

  getImdHeatwaveAlertsDissemintationForEachBlock(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heatwave_alerts_dissemintation_block_get?id=' +
        param.id
    );
  }

  getImdHeatwaveAlertsDissemintationForFavBlock(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heatwave_alerts_dissemintation_fav_block_get?id=' +
        param.id
    );
  }

  //get heatindex data of blocks under a district
  getImdHeatIndexForBlocksInDistrict(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heat_index_ensemble_all_block_by_district_data_get?id=' +
        param
    );
  }

  //get heatwave data of blocks under a district
  getImdHeatwaveForBlocksInDistrict(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heat_fcst_alerts_dissemintation_5days_imd_data_for_all_block_by_district_map_get?id=' +
        param
    );
  }

  //10 day imd data on district level for weather forecast
  get10daysImdDistrictHeatwaveHeatIndex() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heat_index_imd_district_data_for_map_get'
    );
  }

  getRegisteredLocLightningData(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/block_advisory_new?block_id=' +
        param.id
    );
  }

  //get lightning thunderstorm data for registered location of user
  getFavLocLightningData(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/fav_block_advisory?user_id=' +
        param.id
    );
  }

  //get dta blocks for potential
  getDtaBlockNames(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/dta_block_advisory?block_id=' +
        param.block_id
    );
  }

  //get dta fav blocks for potential
  getDtaFavBlockNames(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/dta_fav_block_advisory?user_id=' +
        param.user_id
    );
  }

  getTempLocation(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_user/temp_loc_by_user_get?id=' + param.id
    );
  }

  //get user gps based lighting
  getGpsLightningData(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/gps_location_alert?lat=' +
        param.lat +
        '&long=' +
        param.long +
        '&user_id=' +
        param.user_id
    );
  }

  getDeathByHeatwave(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/death_data_get?id=' + param.id
    );
  }

  //total death count of all district
  getTotalDeathByHeatwave() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/total_death_data_get'
    );
  }

  //total death count of all district for map
  getTotalDeathByHeatwaveForMap() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/total_death_data_for_map_get'
    );
  }

  //death count by district id
  getDeathByLightning(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_lightning/death_data_get?id=' + param.id
    );
  }

  //total death count of all district
  getTotalDeathByLightning() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_lightning/total_death_data_get'
    );
  }

  //total death count of all district for map
  getTotalDeathByLightningForMap() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_lightning/total_death_data_for_map_get'
    );
  }

  // get names of all the rivers
  getAllRivers() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/all_river_names_get'
    );
  }

  //get station name according to river id
  getStationByRiver(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/station_by_id_get?id=' + param.id
    );
  }

  //get water level data using station id
  getWaterlevelByStationId(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/waterlevel_by_station_id_get?id=' +
        param.id
    );
  }
  //get all reservoir names
  getAllReservoirNames() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/reservoir_names_get'
    );
  }

  //get reservoir data by id
  getReservoirStorageById(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/reservoir_storeage_by_id_get?id=' +
        param.id
    );
  }

  //get reservoir data by id
  getReservoirDataById(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/reservoir_data_by_id_get?id=' +
        param.id
    );
  }

  getForecastDischargeAllStationByDate(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/forecast_discharge_all_station_get?date=' +
        param.date
    );
  }

  //get water level data for all station for amp
  getWaterlevelForMap() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/all_station_names_for_map_get'
    );
  }

  //get wrf rainfall for map
  getWrfRainfallForMap() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/wrf_data_for_map_get'
    );
  }

  //get ecmwf rainfall for map
  getRcmwfRainfallForMap() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/ecmwf_data_for_map_get'
    );
  }

  //get wrf rainfall forecast by basin name
  getWrfRainfallForecastByBasinName(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/wrf_basin_rainfall_get?basin_name=' +
        param.basin_name +
        '&&date=' +
        param.date
    );
  }

  //get ecmwf rainfall forecast by basin name
  getEcmwfRainfallForecastByBasinName(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_flood/ecmwf_basin_rainfall_get?basin_name=' +
        param.basin_name +
        '&&date=' +
        param.date
    );
  }

  getAllOceanStations() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/ocean_station_names_all_get'
    );
  }

  //get swell overview data(3 days) all station
  getSwellDataOverview(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/swell_data_overview_get?id=' +
        param.id
    );
  }

  //get wave overview data(3 days) all station
  getWaveDataOverview(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/wave_data_overview_get?id=' + param.id
    );
  }

  //get wind overview data(3 days) all station
  getWindDataOverview(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/wind_data_overview_get?id=' + param.id
    );
  }

  getWaveAllStations(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/wave_data_all_station_get?date=' +
        param.date
    );
  }

  getSwellAllStations(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/swell_data_all_station_get?date=' +
        param.date
    );
  }

  //get wind data for all stations
  getWindAllStations(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_ocean/wind_data_all_station_get?date=' +
        param.date
    );
  }

  //get ensemble heat index for all blocks
  getHeatIndexEnsembleDataAllBlock() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heat_index_ensemble_all_block_data_get'
    );
  }

  //get ensemble_data for all blocks
  getEnsembleData() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/heat_fcst_alerts_dissemintation_5days_imd_data_for_map_get'
    );
  }

  //fetch IMD heatwave Alerts dissemintation for each block and each date
  getImdHeatwaveAlertsByBlockAndDate(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/get_heatwave_alert_by_block_id?id=' +
        param.block_id +
        '&&date=' +
        param.date
    );
  }

  //get nowcast data
  getNowcastDataLightning() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/total_record_for_30_min_block'
    );
  }

   //get nowcast data 5mins
   getNowcastDataLightning5Mins() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/total_record_for_5_min_block'
    );
  }
  //get nowcast data 30 mins
  getNowcastDataLightning30Mins() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/total_record_for_30_min_block'
    );
  }

  //get nowcast data 1hr
  getNowcastDataLightning1Hour() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/total_record_for_1_hr_block'
    );
  }

  //get recent_event data
  getRecentEventLightning() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_lightning/recent_event'
    );
  }

  getLxAlerts() {
    return this.httpClient.get(
      'https://api.lxalerts.earthnetworks.com/CellAlerts.aspx?level=1,2,3&nwlat=37.69027&nwlon=62.69888&selat=4.50111&selon=101.033611&format=json&partnerid=B491167B-6969-4A35-893D-0FEE54C6F926'
    );
  }

  weatherUpdatedDate() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_weather/latest_updated_date_get'
    );
  }

  getLatestWeatherForecastData(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/DATA/forecast_data/imd/' +
        param.fab +
        '/' +
        param.date +
        '/info.' +
        param.date +
        '.json'
    );
  }

  //10 day date
  get10DaysDate() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_drought/next_10days_date_get'
    );
  }

  getlightningstats() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_lightning/total_death_data_for_map_by_year_get?year=2011-2012'
    );
  }
  getheatwavestats() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/total_death_data_for_map_by_year_get?year=2012'
    );
  }

  getlightningstatsByYear(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_lightning/total_death_data_for_map_by_year_get?year=' +
        param.year
    );
  }
  getheatwavestatsByYear(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_heatwave/total_death_data_for_map_by_year_get?year=' +
        param.year
    );
  }

  //get sos events snakebite
  getSosEventsSnakebite() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_snakebite/sos_events_get'
    );
  }

  //get snakebite events
  getEventsSnakebite() {
    return this.httpClient.get(
      'https://satark.rimes.int/Api_snakebite/snakebite_report_get'
    );
  }

  //get nearest phc
  getNearestPhc(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_road_accident/nearest_phc_get?lat=' +
        param.lat +
        '&&long=' +
        param.long
    );
  }

  //get nearest sc
  getNearestSc(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_road_accident/nearest_sc_get?lat=' +
        param.lat +
        '&&long=' +
        param.long
    );
  }

  //get all sos events
  getSosEventsAll() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_road_accident/sos_events_get'
    );
  }

  //get all accident reports
  getAccidentReportAll() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_road_accident/accident_report_get'
    );
  }

  //get black spots
  getBlackSpots() {
    return this.httpClient.get(
      'https://satark.rimes.int/api_road_accident/black_spot_get'
    );
  }

  //get nearest ambulance
  getNearestAmbulance(param) {
    return this.httpClient.get(
      'https://satark.rimes.int/api_road_accident/nearest_ambulance_get?lat=' +
        param.lat +
        '&&long=' +
        param.long
    );
  }

}
