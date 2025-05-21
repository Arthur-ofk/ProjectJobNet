import { createAction } from '@reduxjs/toolkit';

export const createVacancyRequest = createAction<any>('vacancy/createVacancyRequest');
export const updateVacancyRequest = createAction<{ vacancyId: string; formData: any }>('vacancy/updateVacancyRequest');
