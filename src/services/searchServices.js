import * as httpRequest from '~/utils/httpRequest';


export const search = async (q, type = 'less') => {
    try {
        const res = await httpRequest.get('/api/Sach', {  // Thêm '/api/Sach' vào đây để chỉ định đường dẫn đầy đủ
            params: {
                q,
                type
            }
        });
        return res.data;
    }
    catch (error) {
        console.log(error);
    }
};

