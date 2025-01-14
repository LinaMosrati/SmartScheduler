import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ProjectMemberRole } from '../../../models/iproject-member';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InviteMemberService {

  private readonly secretKey = 'just-dont-tell-anyone';


  constructor(
    private readonly authService: AuthService
  ) { }

  generateInviteUrl(projectId: string, role: ProjectMemberRole ): string {
    const userId = this.authService.currentUser()?.id;
    const token = this.generateInviteToken(projectId, userId!, role);
    const encodedToken = encodeURIComponent(token); // Encode the token
    return `${window.location.origin}/invite/project/${encodedToken}`;
  }

  /**
   * Encrypts the data into a string and sets a 24-hour expiry time.
   * @param projectId The project ID
   * @param ownerId The owner ID
   * @param role The role of the invited user
   * @returns The encrypted string
   */
  generateInviteToken(projectId: string, ownerId: string, role: ProjectMemberRole): string {
    const data = {
      projectId,
      ownerId,
      role,
      expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
    };

    const stringifiedData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(stringifiedData, this.secretKey).toString();

    return encryptedData;
  }

  /**
   * Decrypts the token and validates its expiry.
   * @param token The encrypted token string
   * @returns The decrypted data if valid; throws an error otherwise
   */
  retrieveInviteData(token: string): { projectId: string; ownerId: string; role: ProjectMemberRole } {
    try {
      const bytes = CryptoJS.AES.decrypt(token, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedData) {
        throw new Error('Invalid token');
      }

      const data = JSON.parse(decryptedData);

      if (Date.now() > data.expiry) {
        throw new Error('Token has expired');
      }

      return {
        projectId: data.projectId,
        ownerId: data.ownerId,
        role: data.role
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
