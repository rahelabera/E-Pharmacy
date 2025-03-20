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
    public function __construct($url)
    {
        //
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
        return (new MailMessage)
                    ->subject('Email Verification ') // Formal subject
                    ->greeting('Dear ' . $notifiable->name . ',') // Personalized greeting
                    ->line('Thank you for registering with us.') // Introduction
                    ->line('To complete your registration, we kindly ask you to verify your email address by clicking the button below:') // Request
                  
                    ->salutation('Best regards,') // Formal closing
                    ->action('Verify Email', $this->url)
                    ->line('If you have any questions, feel free to contact our support team at semretb74@example.com.') // Support contact
                    ->line('If you did not register, no further action is required.');
                  
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
