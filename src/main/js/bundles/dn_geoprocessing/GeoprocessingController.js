/*
 * Copyright (C) 2022 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Geoprocessor from "esri/tasks/Geoprocessor";

export default class GeoprocessingController {

    _processor = undefined;

    deactivate() {
        this._processor = undefined;
    }

    _filterServicesForUser(services) {
        const authentication = this._userService.getAuthentication();
        const filteredServices = [];

        if (!authentication.isAuthenticated()) {
            throw new Error("User is not authenticated");
        } else {
            const user = authentication.getUser();
            const userRoles = this._userService.getAuthorization(user).roles;

            services.forEach(service => {
                if(!service.allowedUserRoles || service.allowedUserRoles.length === 0){
                    filteredServices.push(service);
                } else {
                    userRoles.forEach(role => {
                        if(service.allowedUserRoles.includes(role)){
                            filteredServices.push(service);
                        }
                    });
                }
            });
        }

        return filteredServices;
    }

    _startGeoprocessing(selectedService) {
        const model = this._model;
        const serviceIndex = this._getServiceIndex(model.services, selectedService);

        const url = model.services[serviceIndex].url;
        const params = model.services[serviceIndex].params;
        const synchronous = model.services[serviceIndex].synchronous;

        this._processor = new Geoprocessor({url: url});

        model.resultState = undefined;

        if (synchronous) {
            model.loading = true;
            this._processor.execute(params).then((resolved) => {
                model.loading = false;
                model.resultState = "success";
            }, (rejected) => {
                model.loading = false;
                model.resultState = "failure";
            });
        }
        if (!synchronous) {
            model.loading = true;
            this._processor.submitJob(params).then((resolved) => {
                model.loading = false;
                model.resultState = "success";
            }, (rejected) => {
                model.loading = false;
                model.resultState = "failure";
            });
        }
    }

    _getServiceIndex(service, selectedService) {
        const isSelectedService = (service) => service.title === selectedService;
        return service.findIndex(isSelectedService);
    }
}
