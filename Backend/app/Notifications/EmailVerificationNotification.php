<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailVerificationNotification extends Notification
{
    use Queueable;
    protected $url;

    /**
     * Create a new notification instance.
     */
    public function __construct($url = null)
    {
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // If the URL is passed, it means this is the verification email
        if ($this->url) {
            return (new MailMessage)
                ->subject('Email Verification')
                ->greeting('Dear ' . $notifiable->name . ',')
                ->line('Thank you for registering with us.')
                ->line('To complete your registration, we kindly ask you to verify your email address by clicking the button below:')
                ->action('Verify Email', $this->url)
                ->line('If you have any questions, feel free to contact our support team at support@example.com.')
                ->line('If you did not register, no further action is required.');
        }

        // If the URL is not passed (email is verified)
        return (new MailMessage)
            ->subject('Email Verified')
            ->greeting('Dear ' . $notifiable->name . ',')
            ->line('Congratulations! Your email has been successfully verified.')
            ->line('You can now enjoy all the features of our platform.')
            ->salutation('Best regards,');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [];
    }
}
