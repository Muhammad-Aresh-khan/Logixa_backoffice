import axios from 'axios';

const api = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth endpoints
export const signup = async (username, email, password) => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
};

export const login = async (username, email, password) => {
    const response = await api.post('/auth/login', { username, email, password });
    return response.data;
};

// Organization endpoints
export const createOrganization = async (organizationData) => {
    const response = await api.post('/organization/create', organizationData);
    return response.data;
};

export const viewOrganizations = async () => {
    const response = await api.get('/organization/view');
    return response.data;
};

export const updateBilling = async (organization_name, billing_info) => {
    const response = await api.post('/organization/billing', {
        organization_name,
        billing_info,
    });
    return response.data;
};

// License endpoints
export const getPackages = async () => {
    const response = await api.get('/license/packages_selection');
    return response.data;
};

export const renewLicense = async (licenseData) => {
    const response = await api.post('/license/renew', licenseData);
    return response.data;
};

export const viewLicenses = async (organizationName = null) => {
    const url = organizationName
        ? `/license/view?organization_name=${encodeURIComponent(organizationName)}`
        : '/license/view';
    const response = await api.get(url);
    return response.data;
};

// Stats endpoints
export const getDashboardStats = async () => {
    const response = await api.get('/stats/summary');
    return response.data;
};

export default api;
