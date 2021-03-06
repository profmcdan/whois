import dotenv from 'dotenv';
import axios from 'axios';
// eslint-disable-next-line import/no-cycle
import * as attachments from './attachments';

dotenv.config();

const baseURL = process.env.API_BASE_URL;

export default class Andelan {
  constructor(userData, userSkills) {
    this.userData = userData;
    this.userSkills = userSkills;
  }

  get fullName() {
    const { first_name: firstName, last_name: lastName } = this.userData;
    return `${attachments.capitalize(firstName)} ${attachments.capitalize(lastName)}`;
  }

  get profile() {
    const {
      cohort, email, github, location, level, roles, phone_number: phoneNumber, name, id,
    } = this.userData;
    const profile = {
      cohort, email, github, location, level, roles, phoneNumber, name, id,
    };
    return attachments.profileTemplate(profile);
  }

  get bio() {
    const { bio, name } = this.userData;
    return attachments.bioTemplate({ bio, name });
  }

  get placement() {
    if (!this.userData.placement) return null;
    const {
      name,
      placement: {
        status, client: partner, start_date: startDate,
      },
    } = this.userData;
    return attachments.placementTemplate({
      name, status, partner, startDate,
    });
  }

  get skills() {
    if (!this.userSkills) return null;
    const {
      apprenticeship_stack: apprenticeshipStack,
      pluralsight,
      partner_experience: partnerExperience,
      partner_staffing: partnerStaffing,
      staff_assessed: staffAssessed,
      self_assessed: selfAssessed,
      simulation_stack: simulationStack,
    } = this.userSkills;
    const { name } = this.userData;
    const skills = {
      name,
      apprenticeshipStack,
      pluralsight,
      partnerExperience,
      partnerStaffing,
      staffAssessed,
      selfAssessed,
      simulationStack,
    };
    return attachments.skillsTemplate(skills);
  }

  static getUserWithEmail(email) {
    return axios
      .get(`${baseURL}/api/v1/users?email=${email}`, {
        headers: { 'api-token': process.env.API_TOKEN },
      })
      .then(response => response.data.values[0]);
  }

  static getSkillsWithId(id) {
    return axios
      .get(`${baseURL}/api/v1/skills/tech/developerskills/${id}`, {
        headers: { 'api-token': process.env.API_TOKEN },
      })
      .then(response => response.data.skills);
  }

  static isFellow(roles) {
    return roles.map(role => role.name.toLowerCase()).includes('fellow');
  }
}
