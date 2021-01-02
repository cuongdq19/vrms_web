import { delay, put } from 'redux-saga/effects';

import * as actions from '../actions';

export function* fetchServicePackages(action) {
  try {
    const mockupData = [
      {
        id: 1,
        name: 'Goi bao duong',
        milestone: 0.0,
        sectionId: 1,
        sectionName: 'Thân xe',
        providerId: 1,
        packagedServices: [
          {
            id: 1,
            name: 'Ve sinh noi that',
            price: 100000.0,
            parts: [],
            modelIds: [1, 2],
          },
          {
            id: 2,
            name: 'Ve sinh ngoai that',
            price: 100000.0,
            parts: [],
            modelIds: [1, 2, 3, 4],
          },
          {
            id: 3,
            name: 'Thay the he thong phanh',
            price: 200000.0,
            parts: [
              {
                id: 1,
                name: 'Bộ phanh đĩa, phanh đĩa JP',
                description:
                  '\nĐộ dày [mm]: 16,5\nHệ thống phanh: Bosch\ntrạng thái: Còn mới',
                quantity: 2.0,
                price: 427000.0,
                warrantyDuration: 0,
                monthsPerMaintenance: 0,
                imageUrls: [
                  'https://storage.googleapis.com/vrms-290212.appspot.com/31c9361a-06be-4888-af29-39381c53e92dthumb.jpg?GoogleAccessId=firebase-adminsdk-y2tzh@vrms-290212.iam.gserviceaccount.com&Expires=2472004383&Signature=ba0w%2FvP6wc3AB8cIyeoKYArUiyK4dG2%2BjA0drmvHNWeolcUBaZdxhkw2C3DJNCbQoZlCHbraRtoHJYWzM7KHGGFq%2FP6RE%2BXMCP3q%2BkZMjvn9TBccQi00yvd2hxBdLGzrq5AhjeFxEBqJ2j2x9hEEbaOlxXXp25I3035QqL7WE0dd0Y1Lggy0fK0ov%2BVS6fkwsfsicYz58dj4IfKxfxA2B5piRYXzmIbpEfiafppqA6ogrVRAS60dfi%2F7W%2FrI00o05IgM8S6pb9cCFrXLb62vGJhJM%2FSaeRafhVhyWwNErktUChcWF4O%2BLx7AkdVWboaBJxiHkRsylW8LOuA%2FHDEgwQ%3D%3D',
                ],
                sectionId: 14,
                categoryId: 106,
                categoryName: 'Dĩa thắng',
              },
            ],
            modelIds: [],
          },
        ],
      },
    ];
    const packagesData = yield delay(1000, mockupData);
    yield put(actions.fetchServicePackagesSuccess(packagesData));
  } catch (error) {
    console.log(error);
  }
}
