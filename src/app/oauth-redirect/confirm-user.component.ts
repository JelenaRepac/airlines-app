import { Component, OnInit } from '@angular/core';
import { UploadService } from '../service/passport.service';

@Component({
  selector: 'app-oauth-redirect',
  template: `<p>Authorizing...</p>`,
})
export class OAuthRedirectComponent implements OnInit {
  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const userIdStr = localStorage.getItem("userId");
    const fileName = localStorage.getItem("pendingFileName");
    const fileBytes = localStorage.getItem("pendingFileBytes");

    if (userIdStr && fileName && fileBytes) {
      const byteArray = new Uint8Array(JSON.parse(fileBytes));
      const file = new File([byteArray], fileName);

      this.uploadService.uploadFile(file, +userIdStr).subscribe({
        next: () => {
          console.log('File uploaded successfully');
          localStorage.removeItem("pendingFileName");
          localStorage.removeItem("pendingFileBytes");
          window.close(); // Close the tab after upload
        },
        error: (err) => {
          console.error('Upload failed', err);
        }
      });
    } else {
      console.warn("No file or user ID found in localStorage.");
    }
  }
}
